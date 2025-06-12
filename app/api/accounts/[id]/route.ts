import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la actualización de cuentas
const updateAccountSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  type: z.enum(["BANK", "CRYPTO", "OTHER"]).optional(),
  balance: z.number().optional(),
  currency: z.string().min(1, "La moneda es requerida").optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden ver las cuentas
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para ver las cuentas" }, { status: 403 })
    }

    const { id } = params

    // Obtener la cuenta
    const account = await db.account.findUnique({
      where: { id },
    })

    if (!account) {
      return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 })
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error("Error al obtener cuenta:", error)
    return NextResponse.json({ error: "Error al obtener la cuenta" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden actualizar cuentas
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para actualizar cuentas" }, { status: 403 })
    }

    const { id } = params
    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = updateAccountSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    // Verificar si la cuenta existe
    const account = await db.account.findUnique({
      where: { id },
    })

    if (!account) {
      return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 })
    }

    const { name, type, balance, currency } = validationResult.data

    // Actualizar la cuenta
    const updatedAccount = await db.account.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(balance !== undefined && { balance }),
        ...(currency && { currency }),
      },
    })

    return NextResponse.json(updatedAccount)
  } catch (error) {
    console.error("Error al actualizar cuenta:", error)
    return NextResponse.json({ error: "Error al actualizar la cuenta" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden eliminar cuentas
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para eliminar cuentas" }, { status: 403 })
    }

    const { id } = params

    // Verificar si la cuenta existe
    const account = await db.account.findUnique({
      where: { id },
    })

    if (!account) {
      return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 })
    }

    // Eliminar la cuenta
    await db.account.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Cuenta eliminada correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar cuenta:", error)
    return NextResponse.json({ error: "Error al eliminar la cuenta" }, { status: 500 })
  }
}
