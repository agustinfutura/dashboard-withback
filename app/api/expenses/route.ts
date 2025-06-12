import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la creación de gastos
const createExpenseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  amount: z.number().positive(),
  category: z.enum(["SALARIES", "SERVICES", "SOFTWARE", "MARKETING", "MAINTENANCE", "OTHER"]),
  isRecurring: z.boolean().default(false),
  dueDate: z.string().datetime().optional(),
  paidDate: z.string().datetime().optional(),
})

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden ver los gastos
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para ver los gastos" }, { status: 403 })
    }

    // Obtener todos los gastos
    const expenses = await db.expense.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Error al obtener gastos:", error)
    return NextResponse.json({ error: "Error al obtener los gastos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden crear gastos
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para crear gastos" }, { status: 403 })
    }

    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = createExpenseSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const { name, amount, category, isRecurring, dueDate, paidDate } = validationResult.data

    // Crear el gasto
    const expense = await db.expense.create({
      data: {
        name,
        amount,
        category,
        isRecurring,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        paidDate: paidDate ? new Date(paidDate) : undefined,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error("Error al crear gasto:", error)
    return NextResponse.json({ error: "Error al crear el gasto" }, { status: 500 })
  }
}
