import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TicketActionsProps {
  ticketId: string
}

export function TicketActions({ ticketId }: TicketActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Cambiar estado</Label>
          <Select defaultValue="open">
            <SelectTrigger id="status">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Abierto</SelectItem>
              <SelectItem value="in_progress">En progreso</SelectItem>
              <SelectItem value="waiting_client">Esperando cliente</SelectItem>
              <SelectItem value="resolved">Resuelto</SelectItem>
              <SelectItem value="closed">Cerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Cambiar prioridad</Label>
          <Select defaultValue="high">
            <SelectTrigger id="priority">
              <SelectValue placeholder="Seleccionar prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assign">Asignar a</Label>
          <Select defaultValue="agent1">
            <SelectTrigger id="assign">
              <SelectValue placeholder="Seleccionar agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent1">Laura Sánchez</SelectItem>
              <SelectItem value="agent2">Carlos Gómez</SelectItem>
              <SelectItem value="agent3">María López</SelectItem>
              <SelectItem value="agent4">Juan Pérez</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2 space-y-2">
          <Button className="w-full">Guardar cambios</Button>
          <Button variant="outline" className="w-full">
            Fusionar tickets
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
