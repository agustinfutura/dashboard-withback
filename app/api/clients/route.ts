import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la creación de clientes
const createClientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  status: z.enum(["ACTIVE", "INACTIVE", "DELINQUENT", "CANCELLED"]).default("ACTIVE"),
  agentId: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar si el usuario es administrador o agente
    if (session.user.role !== "ADMIN" && session.user.role !== "AGENT") {
      return NextResponse.json({ error: "No tienes permisos para acceder a esta información" }, { status: 403 })
    }

    // Obtener todos los clientes con sus usuarios asociados
    const clients = await db.client.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error("Error al obtener clientes:", error)
    return NextResponse.json({ error: "Error al obtener los clientes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar si el usuario es administrador
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para crear clientes" }, { status: 403 })
    }

    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = createClientSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const { name, email, status, agentId } = validationResult.data

    // Verificar si ya existe un usuario con ese email
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Ya existe un usuario con ese email" }, { status: 400 })
    }

    // Crear el usuario y el cliente en una transacción
    const result = await db.$transaction(async (prisma) => {
      // Crear el usuario
      const user = await prisma.user.create({
        data: {
          name,
          email,
          role: "USER",
        },
      })

      // Crear el cliente asociado al usuario
      const client = await prisma.client.create({
        data: {
          userId: user.id,
          status,
          agentId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return client
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error al crear cliente:", error)
    return NextResponse.json({ error: "Error al crear el cliente" }, { status: 500 })
  }
}
