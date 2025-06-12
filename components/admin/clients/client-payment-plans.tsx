import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

interface ClientPaymentPlansProps {
  clientId: string
}

export function ClientPaymentPlans({ clientId }: ClientPaymentPlansProps) {
  // En un caso real, estos datos vendrían de una API
  const paymentPlans = [
    {
      id: "PP-001",
      name: "Desarrollo de Software",
      totalAmount: 5000,
      remainingAmount: 3000,
      installments: 10,
      paidInstallments: 4,
      startDate: "2023-02-15",
      nextPaymentDate: "2023-07-15",
      status: "active",
    },
    {
      id: "PP-002",
      name: "Implementación de CRM",
      totalAmount: 2500,
      remainingAmount: 500,
      installments: 5,
      paidInstallments: 4,
      startDate: "2023-04-10",
      nextPaymentDate: "2023-08-10",
      status: "active",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Planes de Pago</h3>
        <Link href={`/admin/clientes/${clientId}/planes/nuevo`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Plan de Pago
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {paymentPlans.map((plan) => {
          // Calcular el progreso del plan
          const progressPercentage = (plan.paidInstallments / plan.installments) * 100

          return (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>ID: {plan.id}</CardDescription>
                  </div>
                  <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                    {plan.status === "active" ? "Activo" : "Completado"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monto total:</span>
                      <span className="font-medium">${plan.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monto restante:</span>
                      <span className="font-medium">${plan.remainingAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cuotas:</span>
                      <span>
                        {plan.paidInstallments} de {plan.installments}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Próximo pago:</span>
                      <span>{new Date(plan.nextPaymentDate).toLocaleDateString("es-ES")}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Ver pagos
                </Button>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {paymentPlans.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">Este cliente no tiene planes de pago activos</p>
            <Link href={`/admin/clientes/${clientId}/planes/nuevo`}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Plan de Pago
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
