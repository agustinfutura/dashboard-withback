import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la actualización de pagos
const updatePaymentSchema = z.object({
  amount: z.number().positive().optional(),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).optional(),
  paymentDate: z.string().datetime().optional(),
  description: z.string().optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = params

    // Obtener el pago con sus relaciones
    const payment = await db.payment.findUnique({
      where: { id },
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
    })

    if (!payment) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 })
    }

    // Verificar permisos
    const isAdmin = session.user.role === "ADMIN"
    const isClient = session.user.role === "USER" && payment.client.userId === session.user.id

    // Si es un agente, verificar que el pago pertenezca a uno de sus clientes
    let isAuthorizedAgent = false

    if (session.user.role === "AGENT") {
      isAuthorizedAgent = payment.client.agentId === session.user.id
    }

    if (!isAdmin && !isClient && !isAuthorizedAgent) {
      return NextResponse.json({ error: "No tienes permisos para ver este pago" }, { status: 403 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Error al obtener pago:", error)
    return NextResponse.json({ error: "Error al obtener el pago" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores y agentes pueden actualizar pagos
    if (session.user.role !== "ADMIN" && session.user.role !== "AGENT") {
      return NextResponse.json({ error: "No tienes permisos para actualizar pagos" }, { status: 403 })
    }

    const { id } = params
    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = updatePaymentSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    // Verificar si el pago existe
    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        client: true,
        paymentPlan: true,
      },
    })

    if (!payment) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 })
    }

    // Si es un agente, verificar que el pago pertenezca a uno de sus clientes
    if (session.user.role === "AGENT" && payment.client.agentId !== session.user.id) {
      return NextResponse.json({ error: "No tienes permisos para actualizar este pago" }, { status: 403 })
    }

    const { amount, status, paymentDate, description } = validationResult.data

    // Actualizar el pago
    const updatedPayment = await db.payment.update({
      where: { id },
      data: {
        ...(amount && { amount }),
        ...(status && { status }),
        ...(paymentDate && { paymentDate: new Date(paymentDate) }),
        ...(description !== undefined && { description }),
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
    })

    // Si el pago está asociado a un plan de pago y se cambió el estado a completado, actualizar el monto restante
    if (payment.paymentPlanId && status === "COMPLETED" && payment.status !== "COMPLETED") {
      const paymentPlan = await db.paymentPlan.findUnique({
        where: { id: payment.paymentPlanId },
      })

      if (paymentPlan) {
        const newRemainingAmount = Math.max(0, paymentPlan.remainingAmount - payment.amount)

        await db.paymentPlan.update({
          where: { id: payment.paymentPlanId },
          data: {
            remainingAmount: newRemainingAmount,
            // Actualizar la fecha del próximo pago
            nextPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          },
        })
      }
    }

    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error("Error al actualizar pago:", error)
    return NextResponse.json({ error: "Error al actualizar el pago" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden eliminar pagos
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para eliminar pagos" }, { status: 403 })
    }

    const { id } = params

    // Verificar si el pago existe
    const payment = await db.payment.findUnique({
      where: { id },
    })

    if (!payment) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 })
    }

    // Eliminar el pago
    await db.payment.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Pago eliminado correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar pago:", error)
    return NextResponse.json({ error: "Error al eliminar el pago" }, { status: 500 })
  }
}
