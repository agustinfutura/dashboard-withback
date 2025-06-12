import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la creación de pagos
const createPaymentSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["SUBSCRIPTION", "PAYMENT_PLAN", "CAPITAL_CONTRIBUTION"]),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).default("PENDING"),
  paymentDate: z.string().datetime(),
  description: z.string().optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = params

    // Verificar si el plan de pago existe
    const paymentPlan = await db.paymentPlan.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!paymentPlan) {
      return NextResponse.json({ error: "Plan de pago no encontrado" }, { status: 404 })
    }

    // Verificar permisos
    const isAdmin = session.user.role === "ADMIN"
    const isClient = session.user.role === "USER" && paymentPlan.userId === session.user.id

    // Si es un agente, verificar que el plan de pago pertenezca a uno de sus clientes
    let isAuthorizedAgent = false

    if (session.user.role === "AGENT") {
      const client = await db.client.findUnique({
        where: { userId: paymentPlan.userId },
      })

      isAuthorizedAgent = client?.agentId === session.user.id
    }

    if (!isAdmin && !isClient && !isAuthorizedAgent) {
      return NextResponse.json({ error: "No tienes permisos para ver los pagos de este plan" }, { status: 403 })
    }

    // Obtener los pagos del plan
    const payments = await db.payment.findMany({
      where: {
        paymentPlanId: id,
      },
      orderBy: {
        paymentDate: "desc",
      },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error al obtener pagos:", error)
    return NextResponse.json({ error: "Error al obtener los pagos del plan" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores y agentes pueden crear pagos
    if (session.user.role !== "ADMIN" && session.user.role !== "AGENT") {
      return NextResponse.json({ error: "No tienes permisos para crear pagos" }, { status: 403 })
    }

    const { id } = params
    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = createPaymentSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    // Verificar si el plan de pago existe
    const paymentPlan = await db.paymentPlan.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!paymentPlan) {
      return NextResponse.json({ error: "Plan de pago no encontrado" }, { status: 404 })
    }

    // Si es un agente, verificar que el plan de pago pertenezca a uno de sus clientes
    if (session.user.role === "AGENT") {
      const client = await db.client.findUnique({
        where: { userId: paymentPlan.userId },
      })

      if (!client || client.agentId !== session.user.id) {
        return NextResponse.json({ error: "No tienes permisos para crear pagos para este plan" }, { status: 403 })
      }
    }

    // Obtener el cliente asociado al usuario del plan de pago
    const client = await db.client.findUnique({
      where: { userId: paymentPlan.userId },
    })

    if (!client) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    const { amount, type, status, paymentDate, description } = validationResult.data

    // Crear el pago
    const payment = await db.payment.create({
      data: {
        clientId: client.id,
        amount,
        type,
        status,
        paymentDate: new Date(paymentDate),
        description,
        paymentPlanId: id,
      },
    })

    // Actualizar el monto restante del plan de pago si el pago fue completado
    if (status === "COMPLETED") {
      const newRemainingAmount = Math.max(0, paymentPlan.remainingAmount - amount)

      await db.paymentPlan.update({
        where: { id },
        data: {
          remainingAmount: newRemainingAmount,
          // Actualizar la fecha del próximo pago
          nextPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      })
    }

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error("Error al crear pago:", error)
    return NextResponse.json({ error: "Error al crear el pago" }, { status: 500 })
  }
}
