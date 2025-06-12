import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText } from "lucide-react"
import Link from "next/link"

export function ClientPaymentPlansList() {
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
      payments: [
        {
          id: "PAY-001",
          date: "2023-06-15",
          amount: 500,
          status: "completed",
        },
        {
          id: "PAY-002",
          date: "2023-05-15",
          amount: 500,
          status: "completed",
        },
        {
          id: "PAY-003",
          date: "2023-04-15",
          amount: 500,
          status: "completed",
        },
        {
          id: "PAY-004",
          date: "2023-03-15",
          amount: 500,
          status: "completed",
        },
      ],
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
      payments: [
        {
          id: "PAY-005",
          date: "2023-07-10",
          amount: 500,
          status: "completed",
        },
        {
          id: "PAY-006",
          date: "2023-06-10",
          amount: 500,
          status: "completed",
        },
        {
          id: "PAY-007",
          date: "2023-05-10",
          amount: 500,
          status: "completed",
        },
        {
          id: "PAY-008",
          date: "2023-04-10",
          amount: 500,
          status: "completed",
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Monto total:</div>
                    <div className="font-medium">${plan.totalAmount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Monto restante:</div>
                    <div className="font-medium">${plan.remainingAmount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Cuotas:</div>
                    <div>
                      {plan.paidInstallments} de {plan.installments}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Próximo pago:</div>
                    <div>{new Date(plan.nextPaymentDate).toLocaleDateString("es-ES")}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span>{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Pagos realizados</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plan.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.id}</TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString("es-ES")}</TableCell>
                          <TableCell>${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === "completed" ? "outline" : "secondary"}>
                              {payment.status === "completed" ? "Completado" : "Pendiente"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Link href={`/portal/pagos/${plan.id}`}>
                <Button variant="outline">Ver detalles</Button>
              </Link>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
