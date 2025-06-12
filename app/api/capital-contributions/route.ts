import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la creación de aportes de capital
const createCapitalContributionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["PARTNER_A", "PARTNER_B"]),
  date: z.string().datetime(),
  description: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden ver los aportes de capital
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para ver los aportes de capital" }, { status: 403 })
    }

    // Obtener todos los aportes de capital
    const capitalContributions = await db.capitalContribution.findMany({
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(capitalContributions)
  } catch (error) {
    console.error("Error al obtener aportes de capital:", error)
    return NextResponse.json({ error: "Error al obtener los aportes de capital" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden crear aportes de capital
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para crear aportes de capital" }, { status: 403 })
    }

    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = createCapitalContributionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const { amount, type, date, description } = validationResult.data

    // Crear el aporte de capital
    const capitalContribution = await db.capitalContribution.create({
      data: {
        amount,
        type,
        date: new Date(date),
        description,
      },
    })

    return NextResponse.json(capitalContribution, { status: 201 })
  } catch (error) {
    console.error("Error al crear aporte de capital:", error)
    return NextResponse.json({ error: "Error al crear el aporte de capital" }, { status: 500 })
  }
}
