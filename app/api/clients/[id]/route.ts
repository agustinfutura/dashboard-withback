import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la actualización de clientes
const updateClientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  email: z.string().email("Email inválido").optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DELINQUENT", "CANCELLED"]).optional(),
  agentId: z.string().optional().nullable(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = params

    // Verificar si el usuario es administrador, agente o el propio cliente
    const isAdmin = session.user.role === "ADMIN"
    const isAgent = session.user.role === "AGENT"
    const isOwnClient = session.user.id === id

    if (!isAdmin && !isAgent && !isOwnClient) {
      return NextResponse.json({ error: "No tienes permisos para acceder a esta información" }, { status: 403 })
    }

    // Obtener el cliente con su usuario asociado
    const client = await db.client.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
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
        payments: true,
        documents: true,
      },
    })

    if (!client) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    // Si es el propio cliente, obtener también sus suscripciones y tickets
    if (isOwnClient) {
      const subscriptions = await db.subscription.findMany({
        where: { userId: session.user.id },
        include: {
          invoices: true,
        },
      })

      const tickets = await db.ticket.findMany({
        where: { clientId: session.user.id },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          technician: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          notes: {
            where: {
              isInternal: false,
            },
          },
        },
      })

      return NextResponse.json({
        ...client,
        subscriptions,
        tickets,
      })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error("Error al obtener cliente:", error)
    return NextResponse.json({ error: "Error al obtener el cliente" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar si el usuario es administrador
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para actualizar clientes" }, { status: 403 })
    }

    const { id } = params
    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = updateClientSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const { name, email, status, agentId } = validationResult.data

    // Verificar si el cliente existe
    const existingClient = await db.client.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!existingClient) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    // Actualizar el cliente y el usuario en una transacción
    const result = await db.$transaction(async (prisma) => {
      // Actualizar el usuario si se proporcionaron datos
      if (name || email) {
        await prisma.user.update({
          where: { id: existingClient.userId },
          data: {
            ...(name && { name }),
            ...(email && { email }),
          },
        })
      }

      // Actualizar el cliente
      const updatedClient = await prisma.client.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(agentId !== undefined && { agentId }),
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

      return updatedClient
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error al actualizar cliente:", error)
    return NextResponse.json({ error: "Error al actualizar el cliente" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar si el usuario es administrador
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para eliminar clientes" }, { status: 403 })
    }

    const { id } = params

    // Verificar si el cliente existe
    const existingClient = await db.client.findUnique({
      where: { id },
    })

    if (!existingClient) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    // Eliminar el cliente
    await db.client.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Cliente eliminado correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar cliente:", error)
    return NextResponse.json({ error: "Error al eliminar el cliente" }, { status: 500 })
  }
}
