import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la actualización de planes de pago
const updatePaymentPlanSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  totalAmount: z.number().positive().optional(),
  remainingAmount: z.number().positive().optional(),
  installments: z.number().int().positive().optional(),
  startDate: z.string().datetime().optional(),
  nextPaymentDate: z.string().datetime().optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = params

    // Obtener el plan de pago con sus pagos
    const paymentPlan = await db.paymentPlan.findUnique({
      where: { id },
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
      return NextResponse.json({ error: "No tienes permisos para ver este plan de pago" }, { status: 403 })
    }

    return NextResponse.json(paymentPlan)
  } catch (error) {
    console.error("Error al obtener plan de pago:", error)
    return NextResponse.json({ error: "Error al obtener el plan de pago" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores y agentes pueden actualizar planes de pago
    if (session.user.role !== "ADMIN" && session.user.role !== "AGENT") {
      return NextResponse.json({ error: "No tienes permisos para actualizar planes de pago" }, { status: 403 })
    }

    const { id } = params
    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = updatePaymentPlanSchema.safeParse(body)

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
        return NextResponse.json({ error: "No tienes permisos para actualizar este plan de pago" }, { status: 403 })
      }
    }

    const { name, totalAmount, remainingAmount, installments, startDate, nextPaymentDate } = validationResult.data

    // Actualizar el plan de pago
    const updatedPaymentPlan = await db.paymentPlan.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(totalAmount && { totalAmount }),
        ...(remainingAmount && { remainingAmount }),
        ...(installments && { installments }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(nextPaymentDate && { nextPaymentDate: new Date(nextPaymentDate) }),
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

    return NextResponse.json(updatedPaymentPlan)
  } catch (error) {
    console.error("Error al actualizar plan de pago:", error)
    return NextResponse.json({ error: "Error al actualizar el plan de pago" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden eliminar planes de pago
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para eliminar planes de pago" }, { status: 403 })
    }

    const { id } = params

    // Verificar si el plan de pago existe
    const paymentPlan = await db.paymentPlan.findUnique({
      where: { id },
    })

    if (!paymentPlan) {
      return NextResponse.json({ error: "Plan de pago no encontrado" }, { status: 404 })
    }

    // Eliminar el plan de pago
    await db.paymentPlan.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Plan de pago eliminado correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar plan de pago:", error)
    return NextResponse.json({ error: "Error al eliminar el plan de pago" }, { status: 500 })
  }
}
