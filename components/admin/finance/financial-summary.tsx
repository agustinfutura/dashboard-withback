import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp } from "lucide-react"

export function FinancialSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales (Mes)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$12,345.67</div>
          <div className="flex items-center pt-1 text-xs text-green-500">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            <span>+15.2% del mes anterior</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gastos Totales (Mes)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$8,765.43</div>
          <div className="flex items-center pt-1 text-xs text-red-500">
            <ArrowDownRight className="mr-1 h-3 w-3" />
            <span>+5.4% del mes anterior</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Flujo Neto (Mes)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$3,580.24</div>
          <div className="flex items-center pt-1 text-xs text-green-500">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            <span>+20.1% del mes anterior</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Proyección (Próximo Mes)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$13,750.00</div>
          <div className="flex items-center pt-1 text-xs text-green-500">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            <span>+11.4% del mes actual</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
