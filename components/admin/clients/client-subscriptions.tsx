import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

interface ClientSubscriptionsProps {
  clientId: string
}

export function ClientSubscriptions({ clientId }: ClientSubscriptionsProps) {
  // En un caso real, estos datos vendrían de una API
  const subscriptions = [
    {
      id: "SUB-001",
      name: "Plan Básico",
      status: "active",
      startDate: "2023-01-20",
      endDate: "2024-01-20",
      price: 19.99,
      billingCycle: "monthly",
      nextBillingDate: "2023-07-20",
    },
    {
      id: "SUB-002",
      name: "Plan Premium",
      status: "active",
      startDate: "2023-03-15",
      endDate: "2024-03-15",
      price: 49.99,
      billingCycle: "monthly",
      nextBillingDate: "2023-07-15",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Suscripciones Activas</h3>
        <Link href={`/admin/clientes/${clientId}/suscripciones/nueva`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Suscripción
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{subscription.name}</CardTitle>
                  <CardDescription>ID: {subscription.id}</CardDescription>
                </div>
                <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                  {subscription.status === "active" ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Precio:</span>
                  <span className="font-medium">${subscription.price}/mes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ciclo de facturación:</span>
                  <span>{subscription.billingCycle === "monthly" ? "Mensual" : "Anual"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de inicio:</span>
                  <span>{new Date(subscription.startDate).toLocaleDateString("es-ES")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de renovación:</span>
                  <span>{new Date(subscription.endDate).toLocaleDateString("es-ES")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Próximo cobro:</span>
                  <span>{new Date(subscription.nextBillingDate).toLocaleDateString("es-ES")}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Ver facturas
              </Button>
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {subscriptions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">Este cliente no tiene suscripciones activas</p>
            <Link href={`/admin/clientes/${clientId}/suscripciones/nueva`}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Suscripción
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
