import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la creación de tickets
const createTicketSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  assignedAgentId: z.string().optional(),
  assignedTechId: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    let tickets

    // Si es un cliente, solo puede ver sus propios tickets
    if (session.user.role === "USER") {
      tickets = await db.ticket.findMany({
        where: {
          clientId: session.user.id,
        },
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
        orderBy: {
          createdAt: "desc",
        },
      })
    }
    // Si es un agente, puede ver los tickets asignados a él o sin asignar
    else if (session.user.role === "AGENT") {
      tickets = await db.ticket.findMany({
        where: {
          OR: [{ assignedAgentId: session.user.id }, { assignedAgentId: null }],
        },
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
        orderBy: {
          createdAt: "desc",
        },
      })
    }
    // Si es un técnico, puede ver los tickets asignados a él
    else if (session.user.role === "TECHNICIAN") {
      tickets = await db.ticket.findMany({
        where: {
          assignedTechId: session.user.id,
        },
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
        orderBy: {
          createdAt: "desc",
        },
      })
    }
    // Si es un administrador, puede ver todos los tickets
    else {
      tickets = await db.ticket.findMany({
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
        orderBy: {
          createdAt: "desc",
        },
      })
    }

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error al obtener tickets:", error)
    return NextResponse.json({ error: "Error al obtener los tickets" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = createTicketSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const { title, description, priority, assignedAgentId, assignedTechId } = validationResult.data

    // Crear el ticket
    const ticket = await db.ticket.create({
      data: {
        title,
        description,
        priority,
        clientId: session.user.id,
        assignedAgentId,
        assignedTechId,
        status: "OPEN",
      },
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

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error("Error al crear ticket:", error)
    return NextResponse.json({ error: "Error al crear el ticket" }, { status: 500 })
  }
}
