import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la actualización de aportes de capital
const updateCapitalContributionSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(["PARTNER_A", "PARTNER_B"]).optional(),
  date: z.string().datetime().optional(),
  description: z.string().optional().nullable(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden ver los aportes de capital
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para ver los aportes de capital" }, { status: 403 })
    }

    const { id } = params

    // Obtener el aporte de capital
    const capitalContribution = await db.capitalContribution.findUnique({
      where: { id },
    })

    if (!capitalContribution) {
      return NextResponse.json({ error: "Aporte de capital no encontrado" }, { status: 404 })
    }

    return NextResponse.json(capitalContribution)
  } catch (error) {
    console.error("Error al obtener aporte de capital:", error)
    return NextResponse.json({ error: "Error al obtener el aporte de capital" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden actualizar aportes de capital
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para actualizar aportes de capital" }, { status: 403 })
    }

    const { id } = params
    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = updateCapitalContributionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    // Verificar si el aporte de capital existe
    const capitalContribution = await db.capitalContribution.findUnique({
      where: { id },
    })

    if (!capitalContribution) {
      return NextResponse.json({ error: "Aporte de capital no encontrado" }, { status: 404 })
    }

    const { amount, type, date, description } = validationResult.data

    // Actualizar el aporte de capital
    const updatedCapitalContribution = await db.capitalContribution.update({
      where: { id },
      data: {
        ...(amount && { amount }),
        ...(type && { type }),
        ...(date && { date: new Date(date) }),
        ...(description !== undefined && { description }),
      },
    })

    return NextResponse.json(updatedCapitalContribution)
  } catch (error) {
    console.error("Error al actualizar aporte de capital:", error)
    return NextResponse.json({ error: "Error al actualizar el aporte de capital" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden eliminar aportes de capital
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para eliminar aportes de capital" }, { status: 403 })
    }

    const { id } = params

    // Verificar si el aporte de capital existe
    const capitalContribution = await db.capitalContribution.findUnique({
      where: { id },
    })

    if (!capitalContribution) {
      return NextResponse.json({ error: "Aporte de capital no encontrado" }, { status: 404 })
    }

    // Eliminar el aporte de capital
    await db.capitalContribution.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Aporte de capital eliminado correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar aporte de capital:", error)
    return NextResponse.json({ error: "Error al eliminar el aporte de capital" }, { status: 500 })
  }
}
