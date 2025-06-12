import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la creación de suscripciones
const createSubscriptionSchema = z.object({
  userId: z.string(),
  type: z.enum(["MONTHLY", "ANNUAL", "CUSTOM"]).default("MONTHLY"),
  status: z.enum(["ACTIVE", "OVERDUE", "CANCELLED", "PAUSED"]).default("ACTIVE"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  price: z.number().positive(),
})

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    let subscriptions

    // Si es un cliente, solo puede ver sus propias suscripciones
    if (session.user.role === "USER") {
      subscriptions = await db.subscription.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          invoices: true,
        },
      })
    }
    // Si es un agente, puede ver las suscripciones de sus clientes
    else if (session.user.role === "AGENT") {
      // Obtener los clientes asignados al agente
      const clients = await db.client.findMany({
        where: {
          agentId: session.user.id,
        },
      })

      const clientUserIds = clients.map((client) => client.userId)

      subscriptions = await db.subscription.findMany({
        where: {
          userId: {
            in: clientUserIds,
          },
        },
        include: {
          invoices: true,
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
    // Si es un administrador, puede ver todas las suscripciones
    else {
      subscriptions = await db.subscription.findMany({
        include: {
          invoices: true,
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

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Error al obtener suscripciones:", error)
    return NextResponse.json({ error: "Error al obtener las suscripciones" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores y agentes pueden crear suscripciones
    if (session.user.role !== "ADMIN" && session.user.role !== "AGENT") {
      return NextResponse.json({ error: "No tienes permisos para crear suscripciones" }, { status: 403 })
    }

    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = createSubscriptionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const { userId, type, status, startDate, endDate, price } = validationResult.data

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
          { error: "No tienes permisos para crear suscripciones para este cliente" },
          { status: 403 },
        )
      }
    }

    // Crear la suscripción
    const subscription = await db.subscription.create({
      data: {
        userId,
        type,
        status,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        price,
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

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error("Error al crear suscripción:", error)
    return NextResponse.json({ error: "Error al crear la suscripción" }, { status: 500 })
  }
}
