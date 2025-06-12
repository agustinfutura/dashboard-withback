import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function ClientTicketsList() {
  // En un caso real, estos datos vendrían de una API
  const tickets = [
    {
      id: "TK-001",
      title: "Problema con la facturación",
      description: "No he recibido la factura del mes pasado y necesito para mis registros contables.",
      status: "open",
      priority: "high",
      createdAt: "2023-06-18",
      assignedTo: "Laura Sánchez",
      lastUpdated: "2023-06-19",
    },
    {
      id: "TK-002",
      title: "Consulta sobre funcionalidad",
      description: "Me gustaría saber si es posible integrar el sistema con mi plataforma de e-commerce actual.",
      status: "in_progress",
      priority: "medium",
      createdAt: "2023-06-15",
      assignedTo: "Carlos Gómez",
      lastUpdated: "2023-06-17",
    },
    {
      id: "TK-003",
      title: "Solicitud de nueva característica",
      description: "Sería útil tener un panel de análisis de datos más detallado para las ventas mensuales.",
      status: "resolved",
      priority: "low",
      createdAt: "2023-06-10",
      assignedTo: "Juan Pérez",
      lastUpdated: "2023-06-12",
    },
  ]

  // Función para obtener la variante del badge según el estado
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "open":
        return "default"
      case "in_progress":
        return "secondary"
      case "waiting_client":
        return "warning"
      case "resolved":
        return "success"
      case "closed":
        return "outline"
      default:
        return "default"
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Abierto"
      case "in_progress":
        return "En progreso"
      case "waiting_client":
        return "Esperando cliente"
      case "resolved":
        return "Resuelto"
      case "closed":
        return "Cerrado"
      default:
        return status
    }
  }

  // Función para obtener la variante del badge según la prioridad
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "low":
        return "outline"
      case "medium":
        return "secondary"
      case "high":
        return "destructive"
      case "urgent":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Función para obtener el texto de la prioridad
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low":
        return "Baja"
      case "medium":
        return "Media"
      case "high":
        return "Alta"
      case "urgent":
        return "Urgente"
      default:
        return priority
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/portal/tickets/nuevo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Ticket
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{ticket.title}</CardTitle>
                  <CardDescription>ID: {ticket.id}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getStatusVariant(ticket.status)}>{getStatusText(ticket.status)}</Badge>
                  <Badge variant={getPriorityVariant(ticket.priority)}>{getPriorityText(ticket.priority)}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">{ticket.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Creado:</div>
                    <div>{new Date(ticket.createdAt).toLocaleDateString("es-ES")}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Última actualización:</div>
                    <div>{new Date(ticket.lastUpdated).toLocaleDateString("es-ES")}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Asignado a:</div>
                    <div>{ticket.assignedTo}</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link href={`/portal/tickets/${ticket.id}`}>
                <Button variant="outline">Ver detalles</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {tickets.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No tienes tickets de soporte</p>
            <Link href="/portal/tickets/nuevo">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Ticket
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
