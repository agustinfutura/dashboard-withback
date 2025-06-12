import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { TicketsTable } from "@/components/admin/tickets/tickets-table"
import { TicketFilters } from "@/components/admin/tickets/ticket-filters"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function TicketsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Tickets</h2>
        <Link href="/admin/tickets/nuevo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Ticket
          </Button>
        </Link>
      </div>

      <TicketFilters />

      <div className="mt-6">
        <TicketsTable />
      </div>
    </DashboardLayout>
  )
}
