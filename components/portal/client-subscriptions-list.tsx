import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText } from "lucide-react"
import Link from "next/link"

export function ClientSubscriptionsList() {
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
      invoices: [
        {
          id: "INV-001",
          date: "2023-06-20",
          amount: 19.99,
          status: "paid",
        },
        {
          id: "INV-002",
          date: "2023-05-20",
          amount: 19.99,
          status: "paid",
        },
        {
          id: "INV-003",
          date: "2023-04-20",
          amount: 19.99,
          status: "paid",
        },
      ],
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
      invoices: [
        {
          id: "INV-004",
          date: "2023-06-15",
          amount: 49.99,
          status: "paid",
        },
        {
          id: "INV-005",
          date: "2023-05-15",
          amount: 49.99,
          status: "paid",
        },
        {
          id: "INV-006",
          date: "2023-04-15",
          amount: 49.99,
          status: "paid",
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Precio:</div>
                  <div className="font-medium">${subscription.price}/mes</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Ciclo de facturación:</div>
                  <div>{subscription.billingCycle === "monthly" ? "Mensual" : "Anual"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Fecha de inicio:</div>
                  <div>{new Date(subscription.startDate).toLocaleDateString("es-ES")}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Fecha de renovación:</div>
                  <div>{new Date(subscription.endDate).toLocaleDateString("es-ES")}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Próximo cobro:</div>
                  <div>{new Date(subscription.nextBillingDate).toLocaleDateString("es-ES")}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Facturas recientes</h4>
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
                    {subscription.invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString("es-ES")}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={invoice.status === "paid" ? "outline" : "secondary"}>
                            {invoice.status === "paid" ? "Pagada" : "Pendiente"}
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
            <Link href={`/portal/suscripciones/${subscription.id}`}>
              <Button variant="outline">Ver detalles</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
