import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerAuthSession } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = params

    // Obtener el documento
    const document = await db.document.findUnique({
      where: { id },
    })

    if (!document) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 })
    }

    // Verificar permisos
    const isAdmin = session.user.role === "ADMIN"

    // Si es un cliente, solo puede ver sus propios documentos
    if (session.user.role === "USER") {
      // Obtener el ID del cliente
      const client = await db.client.findUnique({
        where: {
          userId: session.user.id,
        },
      })

      if (!client || document.clientId !== client.id) {
        return NextResponse.json({ error: "No tienes permisos para ver este documento" }, { status: 403 })
      }
    }
    // Si es un agente, puede ver los documentos asignados a él y los de sus clientes
    else if (session.user.role === "AGENT" && !isAdmin) {
      // Obtener el ID del agente
      const agent = await db.agent.findUnique({
        where: {
          userId: session.user.id,
        },
      })

      if (!agent) {
        return NextResponse.json({ error: "Agente no encontrado" }, { status: 404 })
      }

      // Verificar si el documento está asignado al agente
      if (document.agentId === agent.id) {
        return NextResponse.json(document)
      }

      // Verificar si el documento pertenece a un cliente del agente
      if (document.clientId) {
        const client = await db.client.findUnique({
          where: {
            id: document.clientId,
          },
        })

        if (!client || client.agentId !== session.user.id) {
          return NextResponse.json({ error: "No tienes permisos para ver este documento" }, { status: 403 })
        }
      } else {
        return NextResponse.json({ error: "No tienes permisos para ver este documento" }, { status: 403 })
      }
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error("Error al obtener documento:", error)
    return NextResponse.json({ error: "Error al obtener el documento" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo administradores pueden eliminar documentos
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para eliminar documentos" }, { status: 403 })
    }

    const { id } = params

    // Verificar si el documento existe
    const document = await db.document.findUnique({
      where: { id },
    })

    if (!document) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 })
    }

    // Eliminar el documento
    await db.document.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Documento eliminado correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error al eliminar documento:", error)
    return NextResponse.json({ error: "Error al eliminar el documento" }, { status: 500 })
  }
}
