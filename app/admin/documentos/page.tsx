import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { DocumentsTable } from "@/components/admin/documents/documents-table"
import { DocumentFilters } from "@/components/admin/documents/document-filters"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Documentación Administrativa</h2>
        <Link href="/admin/documentos/nuevo">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Documento
          </Button>
        </Link>
      </div>

      <DocumentFilters />

      <div className="mt-6">
        <DocumentsTable />
      </div>
    </DashboardLayout>
  )
}
