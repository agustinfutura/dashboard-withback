import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Mail, Phone, MapPin, User } from "lucide-react"

interface ClientDetailsProps {
  client: {
    id: string
    name: string
    email: string
    status: string
    agent: string
    createdAt: string
    phone: string
    address: string
  }
}

export function ClientDetails({ client }: ClientDetailsProps) {
  // Obtener iniciales para el avatar
  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  // Formatear la fecha
  const createdDate = new Date(client.createdAt)
  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(createdDate)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
          <CardDescription>Datos personales y de contacto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-user.jpg" alt={client.name} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{client.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    client.status === "active"
                      ? "default"
                      : client.status === "inactive"
                        ? "secondary"
                        : client.status === "delinquent"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {client.status === "active" && "Activo"}
                  {client.status === "inactive" && "Inactivo"}
                  {client.status === "delinquent" && "Moroso"}
                  {client.status === "cancelled" && "Dado de baja"}
                </Badge>
                <span className="text-sm text-muted-foreground">ID: {client.id}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{client.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>Cliente desde {formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agente Asignado</CardTitle>
          <CardDescription>Información del agente comercial</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-user.jpg" alt={client.agent} />
              <AvatarFallback>CG</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{client.agent}</h3>
              <div className="text-sm text-muted-foreground">Agente Comercial</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>carlos.gomez@ejemplo.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>+1 987 654 321</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>15 clientes asignados</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
