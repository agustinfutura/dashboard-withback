import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function AccountsBalance() {
  // En un caso real, estos datos vendrían de una API
  const accounts = [
    {
      id: "ACC-001",
      name: "Cuenta Bancaria (USD)",
      type: "bank",
      balance: 24563.45,
      currency: "USD",
      percentage: 75,
    },
    {
      id: "ACC-002",
      name: "Wallet Cripto (BTC)",
      type: "crypto",
      balance: 8942.5,
      currency: "USD",
      percentage: 25,
    },
  ]

  // Calcular el balance total
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldo de Cuentas</CardTitle>
        <CardDescription>Balance actual en todas las cuentas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {account.type === "bank" ? "Cuenta Bancaria" : "Wallet Cripto"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${account.balance.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{account.percentage}% del total</div>
                </div>
              </div>
              <Progress value={account.percentage} className="h-2" />
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <div className="font-medium">Balance Total</div>
              <div className="font-bold">${totalBalance.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
