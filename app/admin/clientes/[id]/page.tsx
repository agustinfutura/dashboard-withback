import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { ClientDetails } from "@/components/admin/clients/client-details"
import { ClientSubscriptions } from "@/components/admin/clients/client-subscriptions"
import { ClientPaymentPlans } from "@/components/admin/clients/client-payment-plans"
import { ClientTickets } from "@/components/admin/clients/client-tickets"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

interface ClientPageProps {
  params: {
    id: string
  }
}

export default function ClientPage({ params }: ClientPageProps) {
  const { id } = params

  // En un caso real, aquí se cargarían los datos del cliente desde la API
  const client = {
    id,
    name: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    status: "active",
    agent: "Carlos Gómez",
    createdAt: "2023-01-15",
    phone: "+1 234 567 890",
    address: "Calle Principal 123, Ciudad",
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/clientes">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">
            {client.name}
            <span className="ml-2 text-sm font-normal text-muted-foreground">({client.id})</span>
          </h2>
        </div>
        <Link href={`/admin/clientes/${id}/editar`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Cliente
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="subscriptions">Suscripciones</TabsTrigger>
          <TabsTrigger value="payment-plans">Planes de Pago</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <ClientDetails client={client} />
        </TabsContent>

        <TabsContent value="subscriptions">
          <ClientSubscriptions clientId={id} />
        </TabsContent>

        <TabsContent value="payment-plans">
          <ClientPaymentPlans clientId={id} />
        </TabsContent>

        <TabsContent value="tickets">
          <ClientTickets clientId={id} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
