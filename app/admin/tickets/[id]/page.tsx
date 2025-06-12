import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { TicketDetails } from "@/components/admin/tickets/ticket-details"
import { TicketConversation } from "@/components/admin/tickets/ticket-conversation"
import { TicketActions } from "@/components/admin/tickets/ticket-actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface TicketPageProps {
  params: {
    id: string
  }
}

export default function TicketPage({ params }: TicketPageProps) {
  const { id } = params

  // En un caso real, aquí se cargarían los datos del ticket desde la API
  const ticket = {
    id,
    title: "Problema con la facturación",
    description: "No he recibido la factura del mes pasado y necesito para mis registros contables.",
    status: "open",
    priority: "high",
    createdAt: "2023-06-18",
    client: {
      name: "Juan Pérez",
      email: "juan.perez@ejemplo.com",
    },
    assignedTo: {
      name: "Laura Sánchez",
      email: "laura.sanchez@ejemplo.com",
    },
    lastUpdated: "2023-06-19",
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/tickets">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">
          {ticket.title}
          <span className="ml-2 text-sm font-normal text-muted-foreground">({ticket.id})</span>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <TicketConversation ticketId={id} />
        </div>

        <div className="space-y-6">
          <TicketDetails ticket={ticket} />
          <TicketActions ticketId={id} />
        </div>
      </div>
    </DashboardLayout>
  )
}
