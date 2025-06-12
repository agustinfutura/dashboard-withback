import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la actualización de tickets
const updateTicketSchema = z.object({
  title: z.string().min(1, "El título es requerido").optional(),
  description: z.string().min(1, "La descripción es requerida").optional(),
  status: z.enum(["OPEN", "ASSIGNED", "IN_PROGRESS", "WAITING_CLIENT", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assignedAgentId: z.string().optional().nullable(),
  assignedTechId: z.string().optional().nullable(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = params

    // Obtener el ticket con sus relaciones
    const ticket = await db.ticket.findUnique({
      where: { id },
      include: {
        client: {
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
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        notes: {
          orderBy: {
            createdAt: "asc",
          },
          // Si es cliente, solo mostrar notas no internas
          ...(session.user.role === "USER" && {
            where: {
              isInternal: false,
            },
          }),
        },
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket no encontrado" }, { status: 404 })
    }

    // Verificar permisos
    const isAdmin = session.user.role === "ADMIN"
    const isAgent =
      session.user.role === "AGENT" && (ticket.assignedAgentId === session.user.id || !ticket.assignedAgentId)
    const isTech = session.user.role === "TECHNICIAN" && ticket.assignedTechId === session.user.id
    const isClient = session.user.role === "USER" && ticket.clientId === session.user.id

    if (!isAdmin && !isAgent && !isTech && !isClient) {
      return NextResponse.json({ error: "No tienes permisos para ver este ticket" }, { status: 403 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error al obtener ticket:", error)
    return NextResponse.json({ error: "Error al obtener el ticket" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = updateTicketSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    // Verificar si el ticket existe
    const existingTicket = await db.ticket.findUnique({
      where: { id },
    })

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket no encontrado" }, { status: 404 })
    }

    // Verificar permisos
    const isAdmin = session.user.role === "ADMIN"
    const isAgent =
      session.user.role === "AGENT" &&
      (existingTicket.assignedAgentId === session.user.id || !existingTicket.assignedAgentId)
    const isTech = session.user.role === "TECHNICIAN" && existingTicket.assignedTechId === session.user.id

    // Los clientes solo pueden actualizar sus propios tickets si están abiertos
    const isClient =
      session.user.role === "USER" && existingTicket.clientId === session.user.id && existingTicket.status === "OPEN"

    if (!isAdmin && !isAgent && !isTech && !isClient) {
      return NextResponse.json({ error: "No tienes permisos para actualizar este ticket" }, { status: 403 })
    }

    // Si es cliente, solo puede actualizar título, descripción y prioridad
    const { title, description, status, priority, assignedAgentId, assignedTechId } = validationResult.data

    const updateData: any = {}

    if (isClient) {
      if (title) updateData.title = title
      if (description) updateData.description = description
      if (priority) updateData.priority = priority
    } else {
      // Administradores, agentes y técnicos pueden actualizar todo
      if (title) updateData.title = title
      if (description) updateData.description = description
      if (status) updateData.status = status
      if (priority) updateData.priority = priority
      if (assignedAgentId !== undefined) updateData.assignedAgentId = assignedAgentId
      if (assignedTechId !== undefined) updateData.assignedTechId = assignedTechId
    }

    // Actualizar el ticket
    const updatedTicket = await db.ticket.update({
      where: { id },
      data: updateData,
      include: {
        client: {
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
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error("Error al actualizar ticket:", error)
    return NextResponse.json({ error: "Error al actualizar el ticket" }, { status: 500 })
  }
}
