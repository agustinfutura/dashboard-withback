import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeTable } from "@/components/admin/finance/income-table"
import { ExpensesTable } from "@/components/admin/finance/expenses-table"
import { FinancialSummary } from "@/components/admin/finance/financial-summary"
import { AccountsBalance } from "@/components/admin/finance/accounts-balance"
import { CapitalContributions } from "@/components/admin/finance/capital-contributions"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function FinancePage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Gestión Financiera</h2>
      </div>

      <FinancialSummary />

      <div className="mt-6">
        <AccountsBalance />
      </div>

      <Tabs defaultValue="income" className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="income">Ingresos</TabsTrigger>
            <TabsTrigger value="expenses">Gastos</TabsTrigger>
            <TabsTrigger value="capital">Aportes de Capital</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Link href="/admin/finanzas/nuevo-ingreso">
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Ingreso
              </Button>
            </Link>
            <Link href="/admin/finanzas/nuevo-gasto">
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Gasto
              </Button>
            </Link>
            <Link href="/admin/finanzas/nuevo-aporte">
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Aporte
              </Button>
            </Link>
          </div>
        </div>

        <TabsContent value="income">
          <IncomeTable />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpensesTable />
        </TabsContent>

        <TabsContent value="capital">
          <CapitalContributions />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
