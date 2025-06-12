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
import { ArrowUpDown, MoreHorizontal, UserCog, FileText, Trash2 } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Tipo para los datos del cliente
type Client = {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "delinquent" | "cancelled"
  agent: string
  subscriptions: number
  lastPayment: string
}

// Datos de ejemplo
const data: Client[] = [
  {
    id: "CL-001",
    name: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    status: "active",
    agent: "Carlos Gómez",
    subscriptions: 2,
    lastPayment: "2023-06-15",
  },
  {
    id: "CL-002",
    name: "María López",
    email: "maria.lopez@ejemplo.com",
    status: "delinquent",
    agent: "Laura Sánchez",
    subscriptions: 1,
    lastPayment: "2023-04-20",
  },
  {
    id: "CL-003",
    name: "Roberto García",
    email: "roberto.garcia@ejemplo.com",
    status: "inactive",
    agent: "Juan Pérez",
    subscriptions: 0,
    lastPayment: "2023-02-10",
  },
  {
    id: "CL-004",
    name: "Ana Martínez",
    email: "ana.martinez@ejemplo.com",
    status: "active",
    agent: "María López",
    subscriptions: 3,
    lastPayment: "2023-06-18",
  },
  {
    id: "CL-005",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@ejemplo.com",
    status: "cancelled",
    agent: "Carlos Gómez",
    subscriptions: 0,
    lastPayment: "2023-01-05",
  },
  {
    id: "CL-006",
    name: "Laura Fernández",
    email: "laura.fernandez@ejemplo.com",
    status: "active",
    agent: "Laura Sánchez",
    subscriptions: 1,
    lastPayment: "2023-06-12",
  },
  {
    id: "CL-007",
    name: "Pedro Sánchez",
    email: "pedro.sanchez@ejemplo.com",
    status: "delinquent",
    agent: "Juan Pérez",
    subscriptions: 2,
    lastPayment: "2023-03-25",
  },
  {
    id: "CL-008",
    name: "Sofía Gómez",
    email: "sofia.gomez@ejemplo.com",
    status: "active",
    agent: "María López",
    subscriptions: 1,
    lastPayment: "2023-06-05",
  },
  {
    id: "CL-009",
    name: "Miguel Torres",
    email: "miguel.torres@ejemplo.com",
    status: "inactive",
    agent: "Carlos Gómez",
    subscriptions: 0,
    lastPayment: "2023-04-15",
  },
  {
    id: "CL-010",
    name: "Carmen Ruiz",
    email: "carmen.ruiz@ejemplo.com",
    status: "active",
    agent: "Laura Sánchez",
    subscriptions: 2,
    lastPayment: "2023-06-20",
  },
]

export function ClientsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Definición de columnas
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: "Cliente",
      cell: ({ row }) => {
        const initials = row.original.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt={row.original.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-sm text-muted-foreground">{row.original.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.status

        return (
          <Badge
            variant={
              status === "active"
                ? "default"
                : status === "inactive"
                  ? "secondary"
                  : status === "delinquent"
                    ? "destructive"
                    : "outline"
            }
          >
            {status === "active" && "Activo"}
            {status === "inactive" && "Inactivo"}
            {status === "delinquent" && "Moroso"}
            {status === "cancelled" && "Dado de baja"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "agent",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Agente
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "subscriptions",
      header: "Suscripciones",
      cell: ({ row }) => {
        return <div className="text-center">{row.original.subscriptions}</div>
      },
    },
    {
      accessorKey: "lastPayment",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Último Pago
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        // Formatear la fecha
        const date = new Date(row.original.lastPayment)
        const formattedDate = new Intl.DateTimeFormat("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date)

        return <div>{formattedDate}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const client = row.original

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
              <DropdownMenuItem asChild>
                <Link href={`/admin/clientes/${client.id}`} className="cursor-pointer flex items-center">
                  <UserCog className="mr-2 h-4 w-4" />
                  Ver detalles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/clientes/${client.id}/documentos`} className="cursor-pointer flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Documentos
                </Link>
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
          {data.length} clientes
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
