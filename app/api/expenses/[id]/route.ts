import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la actualización de gastos
const updateExpenseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  amount: z.number().positive().optional(),
  category: z.enum(["SALARIES", "SERVICES", "SOFTWARE", "MARKETING", "MAINTENANCE", "OTHER"]).optional(),
  isRecurring: z.boolean().optional(),
  dueDate: z.string().datetime().optional().nullable(),
  paidDate: z.string().datetime().optional().nullable(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden ver los gastos
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para ver los gastos" }, { status: 403 })
    }

    const { id } = params

    // Obtener el gasto
    const expense = await db.expense.findUnique({
      where: { id },
    })

    if (!expense) {
      return NextResponse.json({ error: "Gasto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error al obtener gasto:", error)
    return NextResponse.json({ error: "Error al obtener el gasto" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden actualizar gastos
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para actualizar gastos" }, { status: 403 })
    }

    const { id } = params
    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = updateExpenseSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    // Verificar si el gasto existe
    const expense = await db.expense.findUnique({
      where: { id },
    })

    if (!expense) {
      return NextResponse.json({ error: "Gasto no encontrado" }, { status: 404 })
    }

    const { name, amount, category, isRecurring, dueDate, paidDate } = validationResult.data

    // Actualizar el gasto
    const updatedExpense = await db.expense.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(amount && { amount }),
        ...(category && { category }),
        ...(isRecurring !== undefined && { isRecurring }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(paidDate !== undefined && { paidDate: paidDate ? new Date(paidDate) : null }),
      },
    })

    return NextResponse.json(updatedExpense)
  } catch (error) {
    console.error("Error al actualizar gasto:", error)
    return NextResponse.json({ error: "Error al actualizar el gasto" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden eliminar gastos
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para eliminar gastos" }, { status: 403 })
    }

    const { id } = params

    // Verificar si el gasto existe
    const expense = await db.expense.findUnique({
      where: { id },
    })

    if (!expense) {
      return NextResponse.json({ error: "Gasto no encontrado" }, { status: 404 })
    }

    // Eliminar el gasto
    await db.expense.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Gasto eliminado correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar gasto:", error)
    return NextResponse.json({ error: "Error al eliminar el gasto" }, { status: 500 })
  }
}
