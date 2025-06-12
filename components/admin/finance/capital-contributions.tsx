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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Tipo para los datos de aportes de capital
type CapitalContribution = {
  id: string
  amount: number
  type: "PARTNER_A" | "PARTNER_B"
  date: string
  description?: string
}

// Datos de ejemplo
const data: CapitalContribution[] = [
  {
    id: "CAP-001",
    amount: 5000.0,
    type: "PARTNER_A",
    date: "2023-06-15",
    description: "Aporte inicial",
  },
  {
    id: "CAP-002",
    amount: 3000.0,
    type: "PARTNER_B",
    date: "2023-06-10",
    description: "Aporte inicial",
  },
  {
    id: "CAP-003",
    amount: 2000.0,
    type: "PARTNER_A",
    date: "2023-05-20",
    description: "Ampliación de capital",
  },
  {
    id: "CAP-004",
    amount: 1500.0,
    type: "PARTNER_B",
    date: "2023-05-15",
    description: "Ampliación de capital",
  },
  {
    id: "CAP-005",
    amount: 1000.0,
    type: "PARTNER_A",
    date: "2023-04-10",
    description: "Inversión en equipamiento",
  },
  {
    id: "CAP-006",
    amount: 800.0,
    type: "PARTNER_B",
    date: "2023-04-05",
    description: "Inversión en equipamiento",
  },
]

export function CapitalContributions() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  // Calcular totales por socio
  const partnerATotal = data
    .filter((contribution) => contribution.type === "PARTNER_A")
    .reduce((sum, contribution) => sum + contribution.amount, 0)

  const partnerBTotal = data
    .filter((contribution) => contribution.type === "PARTNER_B")
    .reduce((sum, contribution) => sum + contribution.amount, 0)

  const totalContributions = partnerATotal + partnerBTotal

  const partnerAPercentage = (partnerATotal / totalContributions) * 100
  const partnerBPercentage = (partnerBTotal / totalContributions) * 100

  // Definición de columnas
  const columns: ColumnDef<CapitalContribution>[] = [
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
      header: "Socio",
      cell: ({ row }) => {
        const type = row.original.type

        return (
          <Badge variant={type === "PARTNER_A" ? "default" : "secondary"}>
            {type === "PARTNER_A" ? "Socio A" : "Socio B"}
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
        const contribution = row.original

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Balance Societario</CardTitle>
          <CardDescription>Distribución de aportes de capital entre socios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Socio A</div>
                  <div className="text-sm text-muted-foreground">{partnerAPercentage.toFixed(1)}% del total</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${partnerATotal.toFixed(2)}</div>
                </div>
              </div>
              <Progress value={partnerAPercentage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Socio B</div>
                  <div className="text-sm text-muted-foreground">{partnerBPercentage.toFixed(1)}% del total</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${partnerBTotal.toFixed(2)}</div>
                </div>
              </div>
              <Progress value={partnerBPercentage} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <div className="font-medium">Total Aportes</div>
                <div className="font-bold">${totalContributions.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center">
          <Input
            placeholder="Buscar aportes..."
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
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)}{" "}
            de {data.length} aportes
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
    </div>
  )
}
