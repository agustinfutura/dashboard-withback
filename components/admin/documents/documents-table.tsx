"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Download, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileIcon, FileTextIcon, FileSpreadsheetIcon, FileIcon as FilePdfIcon } from "lucide-react"

// Tipo para los datos del documento
type Document = {
  id: string
  name: string
  type: "CONTRACT" | "INVOICE" | "REPORT" | "LEGAL" | "OTHER"
  client?: string
  createdAt: string
  size: string
  fileType: "pdf" | "doc" | "xls" | "txt" | "other"
}

// Datos de ejemplo
const data: Document[] = [
  {
    id: "DOC-001",
    name: "Contrato de Servicio - Juan Pérez",
    type: "CONTRACT",
    client: "Juan Pérez",
    createdAt: "2023-01-15",
    size: "1.2 MB",
    fileType: "pdf",
  },
  {
    id: "DOC-002",
    name: "Factura - Enero 2023 - María López",
    type: "INVOICE",
    client: "María López",
    createdAt: "2023-01-20",
    size: "245 KB",
    fileType: "pdf",
  },
  {
    id: "DOC-003",
    name: "Reporte Mensual - Enero 2023",
    type: "REPORT",
    createdAt: "2023-02-05",
    size: "3.5 MB",
    fileType: "xls",
  },
  {
    id: "DOC-004",
    name: "Términos y Condiciones",
    type: "LEGAL",
    createdAt: "2023-01-10",
    size: "520 KB",
    fileType: "doc",
  },
  {
    id: "DOC-005",
    name: "Contrato de Servicio - Roberto García",
    type: "CONTRACT",
    client: "Roberto García",
    createdAt: "2023-02-18",
    size: "1.1 MB",
    fileType: "pdf",
  },
  {
    id: "DOC-006",
    name: "Factura - Febrero 2023 - Ana Martínez",
    type: "INVOICE",
    client: "Ana Martínez",
    createdAt: "2023-02-20",
    size: "250 KB",
    fileType: "pdf",
  },
  {
    id: "DOC-007",
    name: "Manual de Usuario",
    type: "OTHER",
    createdAt: "2023-03-05",
    size: "4.2 MB",
    fileType: "pdf",
  },
  {
    id: "DOC-008",
    name: "Acta de Reunión - 15/03/2023",
    type: "OTHER",
    createdAt: "2023-03-15",
    size: "180 KB",
    fileType: "doc",
  },
]

export function DocumentsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Función para obtener el icono según el tipo de archivo
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FilePdfIcon className="h-4 w-4 text-red-500" />
      case "doc":
        return <FileTextIcon className="h-4 w-4 text-blue-500" />
      case "xls":
        return <FileSpreadsheetIcon className="h-4 w-4 text-green-500" />
      case "txt":
        return <FileTextIcon className="h-4 w-4 text-gray-500" />
      default:
        return <FileIcon className="h-4 w-4 text-gray-500" />
    }
  }

  // Función para obtener el texto del tipo de documento
  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case "CONTRACT":
        return "Contrato"
      case "INVOICE":
        return "Factura"
      case "REPORT":
        return "Reporte"
      case "LEGAL":
        return "Legal"
      case "OTHER":
        return "Otro"
      default:
        return type
    }
  }

  // Definición de columnas
  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => {
        const fileType = row.original.fileType

        return (
          <div className="flex items-center gap-2">
            {getFileIcon(fileType)}
            <span className="font-medium">{row.original.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => {
        const type = row.original.type

        return <Badge variant="outline">{getDocumentTypeText(type)}</Badge>
      },
    },
    {
      accessorKey: "client",
      header: "Cliente",
      cell: ({ row }) => {
        return <div>{row.original.client || "-"}</div>
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Fecha
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        // Formatear la fecha
        const date = new Date(row.original.createdAt)
        const formattedDate = new Intl.DateTimeFormat("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date)

        return <div>{formattedDate}</div>
      },
    },
    {
      accessorKey: "size",
      header: "Tamaño",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const document = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive flex items-center">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} de{" "}
          {data.length} documentos
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
