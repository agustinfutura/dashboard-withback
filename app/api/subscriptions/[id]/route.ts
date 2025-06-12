import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la actualización de suscripciones
const updateSubscriptionSchema = z.object({
  type: z.enum(["MONTHLY", "ANNUAL", "CUSTOM"]).optional(),
  status: z.enum(["ACTIVE", "OVERDUE", "CANCELLED", "PAUSED"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional().nullable(),
  price: z.number().positive().optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = params

    // Obtener la suscripción con sus facturas
    const subscription = await db.subscription.findUnique({
      where: { id },
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

    if (!subscription) {
      return NextResponse.json({ error: "Suscripción no encontrada" }, { status: 404 })
    }

    // Verificar permisos
    const isAdmin = session.user.role === "ADMIN"
    const isClient = session.user.role === "USER" && subscription.userId === session.user.id

    // Si es un agente, verificar que la suscripción pertenezca a uno de sus clientes
    let isAuthorizedAgent = false

    if (session.user.role === "AGENT") {
      const client = await db.client.findUnique({
        where: { userId: subscription.userId },
      })

      isAuthorizedAgent = client?.agentId === session.user.id
    }

    if (!isAdmin && !isClient && !isAuthorizedAgent) {
      return NextResponse.json({ error: "No tienes permisos para ver esta suscripción" }, { status: 403 })
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Error al obtener suscripción:", error)
    return NextResponse.json({ error: "Error al obtener la suscripción" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores y agentes pueden actualizar suscripciones
    if (session.user.role !== "ADMIN" && session.user.role !== "AGENT") {
      return NextResponse.json({ error: "No tienes permisos para actualizar suscripciones" }, { status: 403 })
    }

    const { id } = params
    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = updateSubscriptionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    // Verificar si la suscripción existe
    const subscription = await db.subscription.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!subscription) {
      return NextResponse.json({ error: "Suscripción no encontrada" }, { status: 404 })
    }

    // Si es un agente, verificar que la suscripción pertenezca a uno de sus clientes
    if (session.user.role === "AGENT") {
      const client = await db.client.findUnique({
        where: { userId: subscription.userId },
      })

      if (!client || client.agentId !== session.user.id) {
        return NextResponse.json({ error: "No tienes permisos para actualizar esta suscripción" }, { status: 403 })
      }
    }

    const { type, status, startDate, endDate, price } = validationResult.data

    // Actualizar la suscripción
    const updatedSubscription = await db.subscription.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(status && { status }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(price && { price }),
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

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    console.error("Error al actualizar suscripción:", error)
    return NextResponse.json({ error: "Error al actualizar la suscripción" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden eliminar suscripciones
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para eliminar suscripciones" }, { status: 403 })
    }

    const { id } = params

    // Verificar si la suscripción existe
    const subscription = await db.subscription.findUnique({
      where: { id },
    })

    if (!subscription) {
      return NextResponse.json({ error: "Suscripción no encontrada" }, { status: 404 })
    }

    // Eliminar la suscripción
    await db.subscription.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Suscripción eliminada correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar suscripción:", error)
    return NextResponse.json({ error: "Error al eliminar la suscripción" }, { status: 500 })
  }
}
