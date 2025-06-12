import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"
import { z } from "zod"

// Schema de validación para la creación de documentos
const createDocumentSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.enum(["CONTRACT", "INVOICE", "REPORT", "LEGAL", "OTHER"]),
  url: z.string().url("URL inválida"),
  clientId: z.string().optional(),
  agentId: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    let documents

    // Si es un cliente, solo puede ver sus propios documentos
    if (session.user.role === "USER") {
      // Obtener el ID del cliente
      const client = await db.client.findUnique({
        where: {
          userId: session.user.id,
        },
      })

      if (!client) {
        return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
      }

      documents = await db.document.findMany({
        where: {
          clientId: client.id,
        },
      })
    }
    // Si es un agente, puede ver los documentos asignados a él y los de sus clientes
    else if (session.user.role === "AGENT") {
      // Obtener el ID del agente
      const agent = await db.agent.findUnique({
        where: {
          userId: session.user.id,
        },
      })

      if (!agent) {
        return NextResponse.json({ error: "Agente no encontrado" }, { status: 404 })
      }

      // Obtener los clientes asignados al agente
      const clients = await db.client.findMany({
        where: {
          agentId: session.user.id,
        },
      })

      const clientIds = clients.map((client) => client.id)

      documents = await db.document.findMany({
        where: {
          OR: [{ agentId: agent.id }, { clientId: { in: clientIds } }],
        },
      })
    }
    // Si es un administrador, puede ver todos los documentos
    else {
      documents = await db.document.findMany()
    }

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error al obtener documentos:", error)
    return NextResponse.json({ error: "Error al obtener los documentos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores y agentes pueden crear documentos
    if (session.user.role !== "ADMIN" && session.user.role !== "AGENT") {
      return NextResponse.json({ error: "No tienes permisos para crear documentos" }, { status: 403 })
    }

    const body = await req.json()

    // Validar los datos de entrada
    const validationResult = createDocumentSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const { name, type, url, clientId, agentId } = validationResult.data

    // Crear el documento
    const document = await db.document.create({
      data: {
        name,
        type,
        url,
        clientId,
        agentId,
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Error al crear documento:", error)
    return NextResponse.json({ error: "Error al crear el documento" }, { status: 500 })
  }
}
