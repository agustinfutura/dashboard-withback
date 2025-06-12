import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la creación de cuentas
const createAccountSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.enum(["BANK", "CRYPTO", "OTHER"]),
  balance: z.number().default(0),
  currency: z.string().min(1, "La moneda es requerida"),
})

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden ver las cuentas
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para ver las cuentas" }, { status: 403 })
    }

    // Obtener todas las cuentas
    const accounts = await db.account.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Error al obtener cuentas:", error)
    return NextResponse.json({ error: "Error al obtener las cuentas" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden crear cuentas
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para crear cuentas" }, { status: 403 })
    }

    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = createAccountSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const { name, type, balance, currency } = validationResult.data

    // Crear la cuenta
    const account = await db.account.create({
      data: {
        name,
        type,
        balance,
        currency,
      },
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error("Error al crear cuenta:", error)
    return NextResponse.json({ error: "Error al crear la cuenta" }, { status: 500 })
  }
}
