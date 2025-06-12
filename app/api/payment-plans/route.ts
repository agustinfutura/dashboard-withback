import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la creación de planes de pago
const createPaymentPlanSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "El nombre es requerido"),
  totalAmount: z.number().positive(),
  remainingAmount: z.number().positive(),
  installments: z.number().int().positive(),
  startDate: z.string().datetime(),
  nextPaymentDate: z.string().datetime(),
})

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    let paymentPlans

    // Si es un cliente, solo puede ver sus propios planes de pago
    if (session.user.role === "USER") {
      paymentPlans = await db.paymentPlan.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          payments: true,
        },
      })
    }
    // Si es un agente, puede ver los planes de pago de sus clientes
    else if (session.user.role === "AGENT") {
      // Obtener los clientes asignados al agente
      const clients = await db.client.findMany({
        where: {
          agentId: session.user.id,
        },
      })

      const clientUserIds = clients.map((client) => client.userId)

      paymentPlans = await db.paymentPlan.findMany({
        where: {
          userId: {
            in: clientUserIds,
          },
        },
        include: {
          payments: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    }
    // Si es un administrador, puede ver todos los planes de pago
    else {
      paymentPlans = await db.paymentPlan.findMany({
        include: {
          payments: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    }

    return NextResponse.json(paymentPlans)
  } catch (error) {
    console.error("Error al obtener planes de pago:", error)
    return NextResponse.json({ error: "Error al obtener los planes de pago" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores y agentes pueden crear planes de pago
    if (session.user.role !== "ADMIN" && session.user.role !== "AGENT") {
      return NextResponse.json({ error: "No tienes permisos para crear planes de pago" }, { status: 403 })
    }

    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = createPaymentPlanSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const { userId, name, totalAmount, remainingAmount, installments, startDate, nextPaymentDate } =
      validationResult.data

    // Verificar si el usuario existe
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Si es un agente, verificar que el usuario sea uno de sus clientes
    if (session.user.role === "AGENT") {
      const client = await db.client.findUnique({
        where: { userId },
      })

      if (!client || client.agentId !== session.user.id) {
        return NextResponse.json(
          { error: "No tienes permisos para crear planes de pago para este cliente" },
          { status: 403 },
        )
      }
    }

    // Crear el plan de pago
    const paymentPlan = await db.paymentPlan.create({
      data: {
        userId,
        name,
        totalAmount,
        remainingAmount,
        installments,
        startDate: new Date(startDate),
        nextPaymentDate: new Date(nextPaymentDate),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(paymentPlan, { status: 201 })
  } catch (error) {
    console.error("Error al crear plan de pago:", error)
    return NextResponse.json({ error: "Error al crear el plan de pago" }, { status: 500 })
  }
}
