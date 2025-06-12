import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientSubscriptionsList } from "@/components/portal/client-subscriptions-list"
import { ClientPaymentPlansList } from "@/components/portal/client-payment-plans-list"
import { ClientTicketsList } from "@/components/portal/client-tickets-list"
import { ClientDocumentsList } from "@/components/portal/client-documents-list"
import { ClientAgentInfo } from "@/components/portal/client-agent-info"
import { FileText, LifeBuoy, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ClientDashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Plan Básico, Plan Premium</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planes de Pago</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 activo, 1 completado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Abiertos</CardTitle>
            <LifeBuoy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">2 resueltos recientemente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Pago</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15/07/2023</div>
            <p className="text-xs text-muted-foreground">$69.98 - Suscripciones</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7 mt-4">
        <div className="col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planes de Pago Activos</CardTitle>
              <CardDescription>Estado de tus planes de financiamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">Desarrollo de Software</div>
                      <div className="text-sm text-muted-foreground">4 de 10 cuotas pagadas</div>
                    </div>
                    <Badge>Activo</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Próximo pago: 15/07/2023</span>
                    <span className="font-medium">$500.00</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">Implementación de CRM</div>
                      <div className="text-sm text-muted-foreground">4 de 5 cuotas pagadas</div>
                    </div>
                    <Badge>Activo</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Próximo pago: 10/08/2023</span>
                    <span className="font-medium">$500.00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suscripciones</CardTitle>
              <CardDescription>Tus suscripciones activas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Plan Básico</div>
                    <div className="text-sm text-muted-foreground">Renovación: 20/07/2023</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$19.99/mes</div>
                    <Badge variant="outline">Activa</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Plan Premium</div>
                    <div className="text-sm text-muted-foreground">Renovación: 15/07/2023</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$49.99/mes</div>
                    <Badge variant="outline">Activa</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tu Agente Asignado</CardTitle>
              <CardDescription>Información de contacto</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientAgentInfo />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tickets Recientes</CardTitle>
                <CardDescription>Estado de tus solicitudes de soporte</CardDescription>
              </div>
              <Link href="/portal/tickets/nuevo">
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo Ticket
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Problema con la facturación</div>
                    <div className="text-sm text-muted-foreground">Creado: 18/06/2023</div>
                  </div>
                  <Badge>Abierto</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Consulta sobre funcionalidad</div>
                    <div className="text-sm text-muted-foreground">Actualizado: 17/06/2023</div>
                  </div>
                  <Badge variant="secondary">En progreso</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Solicitud de nueva característica</div>
                    <div className="text-sm text-muted-foreground">Resuelto: 12/06/2023</div>
                  </div>
                  <Badge variant="outline">Resuelto</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="subscriptions" className="mt-6">
        <TabsList>
          <TabsTrigger value="subscriptions">Suscripciones</TabsTrigger>
          <TabsTrigger value="payment-plans">Planes de Pago</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="mt-4">
          <ClientSubscriptionsList />
        </TabsContent>

        <TabsContent value="payment-plans" className="mt-4">
          <ClientPaymentPlansList />
        </TabsContent>

        <TabsContent value="tickets" className="mt-4">
          <ClientTicketsList />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <ClientDocumentsList />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
