import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la creación de pagos
const createPaymentSchema = z.object({
  clientId: z.string(),
  amount: z.number().positive(),
  type: z.enum(["SUBSCRIPTION", "PAYMENT_PLAN", "CAPITAL_CONTRIBUTION"]),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).default("PENDING"),
  paymentDate: z.string().datetime(),
  paymentPlanId: z.string().optional(),
  description: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    let payments

    // Si es un cliente, solo puede ver sus propios pagos
    if (session.user.role === "USER") {
      // Obtener el ID del cliente
      const client = await db.client.findUnique({
        where: {
          userId: session.user.id,
        },
      })

      if (!client) {
        return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
      }

      payments = await db.payment.findMany({
        where: {
          clientId: client.id,
        },
        include: {
          paymentPlan: true,
        },
        orderBy: {
          paymentDate: "desc",
        },
      })
    }
    // Si es un agente, puede ver los pagos de sus clientes
    else if (session.user.role === "AGENT") {
      // Obtener los clientes asignados al agente
      const clients = await db.client.findMany({
        where: {
          agentId: session.user.id,
        },
      })

      const clientIds = clients.map((client) => client.id)

      payments = await db.payment.findMany({
        where: {
          clientId: {
            in: clientIds,
          },
        },
        include: {
          client: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          paymentPlan: true,
        },
        orderBy: {
          paymentDate: "desc",
        },
      })
    }
    // Si es un administrador, puede ver todos los pagos
    else {
      payments = await db.payment.findMany({
        include: {
          client: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          paymentPlan: true,
        },
        orderBy: {
          paymentDate: "desc",
        },
      })
    }

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error al obtener pagos:", error)
    return NextResponse.json({ error: "Error al obtener los pagos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores y agentes pueden crear pagos
    if (session.user.role !== "ADMIN" && session.user.role !== "AGENT") {
      return NextResponse.json({ error: "No tienes permisos para crear pagos" }, { status: 403 })
    }

    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = createPaymentSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const { clientId, amount, type, status, paymentDate, paymentPlanId, description } = validationResult.data

    // Verificar si el cliente existe
    const client = await db.client.findUnique({
      where: { id: clientId },
    })

    if (!client) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    // Si es un agente, verificar que el cliente sea uno de los suyos
    if (session.user.role === "AGENT" && client.agentId !== session.user.id) {
      return NextResponse.json({ error: "No tienes permisos para crear pagos para este cliente" }, { status: 403 })
    }

    // Si se proporciona un plan de pago, verificar que exista
    if (paymentPlanId) {
      const paymentPlan = await db.paymentPlan.findUnique({
        where: { id: paymentPlanId },
      })

      if (!paymentPlan) {
        return NextResponse.json({ error: "Plan de pago no encontrado" }, { status: 404 })
      }

      // Verificar que el plan de pago pertenezca al cliente
      const clientUser = await db.user.findUnique({
        where: { id: client.userId },
      })

      if (!clientUser || paymentPlan.userId !== clientUser.id) {
        return NextResponse.json({ error: "El plan de pago no pertenece a este cliente" }, { status: 400 })
      }
    }

    // Crear el pago
    const payment = await db.payment.create({
      data: {
        clientId,
        amount,
        type,
        status,
        paymentDate: new Date(paymentDate),
        paymentPlanId,
        description,
      },
    })

    // Si el pago está asociado a un plan de pago y está completado, actualizar el monto restante
    if (paymentPlanId && status === "COMPLETED") {
      const paymentPlan = await db.paymentPlan.findUnique({
        where: { id: paymentPlanId },
      })

      if (paymentPlan) {
        const newRemainingAmount = Math.max(0, paymentPlan.remainingAmount - amount)

        await db.paymentPlan.update({
          where: { id: paymentPlanId },
          data: {
            remainingAmount: newRemainingAmount,
            // Actualizar la fecha del próximo pago
            nextPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          },
        })
      }
    }

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error("Error al crear pago:", error)
    return NextResponse.json({ error: "Error al crear el pago" }, { status: 500 })
  }
}
