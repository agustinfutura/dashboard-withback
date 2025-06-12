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

// Tipo para los datos de gastos
type Expense = {
  id: string
  name: string
  amount: number
  category: "salaries" | "services" | "software" | "marketing" | "maintenance" | "other"
  isRecurring: boolean
  dueDate: string
  paidDate?: string
  status: "pending" | "paid"
}

// Datos de ejemplo
const data: Expense[] = [
  {
    id: "EXP-001",
    name: "Salario - Desarrollador Senior",
    amount: 3500.0,
    category: "salaries",
    isRecurring: true,
    dueDate: "2023-06-30",
    status: "pending",
  },
  {
    id: "EXP-002",
    name: "Alquiler de oficina",
    amount: 1200.0,
    category: "services",
    isRecurring: true,
    dueDate: "2023-06-05",
    paidDate: "2023-06-05",
    status: "paid",
  },
  {
    id: "EXP-003",
    name: "Licencia de software - Adobe",
    amount: 52.99,
    category: "software",
    isRecurring: true,
    dueDate: "2023-06-15",
    paidDate: "2023-06-15",
    status: "paid",
  },
  {
    id: "EXP-004",
    name: "Campaña de marketing digital",
    amount: 500.0,
    category: "marketing",
    isRecurring: false,
    dueDate: "2023-06-20",
    status: "pending",
  },
  {
    id: "EXP-005",
    name: "Servicio de internet",
    amount: 89.99,
    category: "services",
    isRecurring: true,
    dueDate: "2023-06-10",
    paidDate: "2023-06-10",
    status: "paid",
  },
  {
    id: "EXP-006",
    name: "Mantenimiento de equipos",
    amount: 150.0,
    category: "maintenance",
    isRecurring: false,
    dueDate: "2023-06-25",
    status: "pending",
  },
  {
    id: "EXP-007",
    name: "Suscripción - AWS",
    amount: 350.0,
    category: "software",
    isRecurring: true,
    dueDate: "2023-06-28",
    status: "pending",
  },
  {
    id: "EXP-008",
    name: "Material de oficina",
    amount: 75.5,
    category: "other",
    isRecurring: false,
    dueDate: "2023-06-08",
    paidDate: "2023-06-08",
    status: "paid",
  },
]

export function ExpensesTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  // Definición de columnas
  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "dueDate",
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
        const date = new Date(row.original.dueDate)
        const formattedDate = new Intl.DateTimeFormat("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date)

        return <div>{formattedDate}</div>
      },
    },
    {
      accessorKey: "name",
      header: "Descripción",
    },
    {
      accessorKey: "category",
      header: "Categoría",
      cell: ({ row }) => {
        const category = row.original.category

        return (
          <Badge variant="outline">
            {category === "salaries" && "Sueldos"}
            {category === "services" && "Servicios"}
            {category === "software" && "Software"}
            {category === "marketing" && "Marketing"}
            {category === "maintenance" && "Mantenimiento"}
            {category === "other" && "Otros"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "isRecurring",
      header: "Recurrente",
      cell: ({ row }) => {
        return <div>{row.original.isRecurring ? "Sí" : "No"}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.status

        return (
          <Badge variant={status === "paid" ? "default" : "secondary"}>
            {status === "paid" ? "Pagado" : "Pendiente"}
          </Badge>
        )
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
        const expense = row.original

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
          placeholder="Buscar gastos..."
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
          {data.length} gastos
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
