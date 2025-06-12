import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { ClientsTable } from "@/components/admin/clients/clients-table"
import { ClientFilters } from "@/components/admin/clients/client-filters"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
        <Link href="/admin/clientes/nuevo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      <ClientFilters />

      <div className="mt-6">
        <ClientsTable />
      </div>
    </DashboardLayout>
  )
}
