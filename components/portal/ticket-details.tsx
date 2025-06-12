import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TicketDetailsProps {
  ticket: {
    id: string
    title: string
    description: string
    status: string
    priority: string
    createdAt: string
    assignedTo?: {
      name: string
      email: string
    }
    lastUpdated: string
  }
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
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
        return "Esperando respuesta"
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

  // Formatear fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Obtener iniciales para el avatar del agente asignado
  const agentInitials = ticket.assignedTo
    ? ticket.assignedTo.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "NA"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del Ticket</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Estado</div>
          <Badge variant={getStatusVariant(ticket.status)}>{getStatusText(ticket.status)}</Badge>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Prioridad</div>
          <Badge variant={getPriorityVariant(ticket.priority)}>{getPriorityText(ticket.priority)}</Badge>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Creado</div>
          <div>{formatDate(ticket.createdAt)}</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Última actualización</div>
          <div>{formatDate(ticket.lastUpdated)}</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Agente asignado</div>
          {ticket.assignedTo ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt={ticket.assignedTo.name} />
                <AvatarFallback>{agentInitials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{ticket.assignedTo.name}</div>
                <div className="text-xs text-muted-foreground">{ticket.assignedTo.email}</div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">Sin asignar</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
