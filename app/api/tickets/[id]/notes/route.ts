import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la creación de notas
const createNoteSchema = z.object({
  content: z.string().min(1, "El contenido es requerido"),
  isInternal: z.boolean().default(false),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = params

    // Verificar si el ticket existe
    const ticket = await db.ticket.findUnique({
      where: { id },
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
      return NextResponse.json({ error: "No tienes permisos para ver las notas de este ticket" }, { status: 403 })
    }

    // Obtener las notas del ticket
    const notes = await db.ticketNote.findMany({
      where: {
        ticketId: id,
        // Si es cliente, solo mostrar notas no internas
        ...(isClient && {
          isInternal: false,
        }),
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error al obtener notas:", error)
    return NextResponse.json({ error: "Error al obtener las notas del ticket" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = createNoteSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const { content, isInternal } = validationResult.data

    // Verificar si el ticket existe
    const ticket = await db.ticket.findUnique({
      where: { id },
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
      return NextResponse.json({ error: "No tienes permisos para añadir notas a este ticket" }, { status: 403 })
    }

    // Los clientes no pueden crear notas internas
    if (isClient && isInternal) {
      return NextResponse.json({ error: "No tienes permisos para crear notas internas" }, { status: 403 })
    }

    // Crear la nota
    const note = await db.ticketNote.create({
      data: {
        ticketId: id,
        content,
        isInternal,
      },
    })

    // Actualizar la fecha de última actualización del ticket
    await db.ticket.update({
      where: { id },
      data: {
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Error al crear nota:", error)
    return NextResponse.json({ error: "Error al crear la nota" }, { status: 500 })
  }
}
