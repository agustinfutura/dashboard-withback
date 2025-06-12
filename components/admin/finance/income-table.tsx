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
import { ArrowUpDown, MoreHorizontal, FileText, Trash2 } from "lucide-react"
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
import { Input } from "@/components/ui/input"

// Tipo para los datos de ingresos
type Income = {
  id: string
  description: string
  amount: number
  type: "subscription" | "payment_plan" | "capital_contribution"
  date: string
  client?: string
  partner?: string
}

// Datos de ejemplo
const data: Income[] = [
  {
    id: "INC-001",
    description: "Pago de suscripción - Plan Básico",
    amount: 19.99,
    type: "subscription",
    date: "2023-06-20",
    client: "Juan Pérez",
  },
  {
    id: "INC-002",
    description: "Pago de suscripción - Plan Premium",
    amount: 49.99,
    type: "subscription",
    date: "2023-06-19",
    client: "María López",
  },
  {
    id: "INC-003",
    description: "Cuota 3/10 - Desarrollo de Software",
    amount: 500.0,
    type: "payment_plan",
    date: "2023-06-18",
    client: "Roberto García",
  },
  {
    id: "INC-004",
    description: "Aporte de capital - Socio A",
    amount: 5000.0,
    type: "capital_contribution",
    date: "2023-06-15",
    partner: "Socio A",
  },
  {
    id: "INC-005",
    description: "Pago de suscripción - Plan Premium",
    amount: 49.99,
    type: "subscription",
    date: "2023-06-15",
    client: "Ana Martínez",
  },
  {
    id: "INC-006",
    description: "Cuota 4/5 - Implementación de CRM",
    amount: 500.0,
    type: "payment_plan",
    date: "2023-06-14",
    client: "Carlos Rodríguez",
  },
  {
    id: "INC-007",
    description: "Pago de suscripción - Plan Básico",
    amount: 19.99,
    type: "subscription",
    date: "2023-06-12",
    client: "Laura Fernández",
  },
  {
    id: "INC-008",
    description: "Aporte de capital - Socio B",
    amount: 3000.0,
    type: "capital_contribution",
    date: "2023-06-10",
    partner: "Socio B",
  },
]

export function IncomeTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  // Definición de columnas
  const columns: ColumnDef<Income>[] = [
    {
      accessorKey: "date",
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
        const date = new Date(row.original.date)
        const formattedDate = new Intl.DateTimeFormat("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date)

        return <div>{formattedDate}</div>
      },
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => {
        const type = row.original.type

        return (
          <Badge variant={type === "subscription" ? "default" : type === "payment_plan" ? "secondary" : "outline"}>
            {type === "subscription" && "Suscripción"}
            {type === "payment_plan" && "Plan de Pago"}
            {type === "capital_contribution" && "Aporte de Capital"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "client",
      header: "Cliente/Socio",
      cell: ({ row }) => {
        return <div>{row.original.client || row.original.partner || "-"}</div>
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="justify-end w-full"
          >
            Monto
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.original.amount.toString())
        const formatted = new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "USD",
        }).format(amount)

        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const income = row.original

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
                <FileText className="mr-2 h-4 w-4" />
                Ver detalles
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
      globalFilter,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Buscar ingresos..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

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
          {data.length} ingresos
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
