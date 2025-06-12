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
import { ArrowUpDown, MoreHorizontal, MessageSquare, UserCog, Trash2 } from "lucide-react"
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

// Tipo para los datos del ticket
type Ticket = {
  id: string
  title: string
  client: {
    name: string
    email: string
  }
  status: "open" | "in_progress" | "waiting_client" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: string
  assignedTo?: {
    name: string
    email: string
  }
  lastUpdated: string
}

// Datos de ejemplo
const data: Ticket[] = [
  {
    id: "TK-001",
    title: "Problema con la facturación",
    client: {
      name: "Juan Pérez",
      email: "juan.perez@ejemplo.com",
    },
    status: "open",
    priority: "high",
    createdAt: "2023-06-18",
    assignedTo: {
      name: "Laura Sánchez",
      email: "laura.sanchez@ejemplo.com",
    },
    lastUpdated: "2023-06-19",
  },
  {
    id: "TK-002",
    title: "Consulta sobre funcionalidad",
    client: {
      name: "María López",
      email: "maria.lopez@ejemplo.com",
    },
    status: "in_progress",
    priority: "medium",
    createdAt: "2023-06-15",
    assignedTo: {
      name: "Carlos Gómez",
      email: "carlos.gomez@ejemplo.com",
    },
    lastUpdated: "2023-06-17",
  },
  {
    id: "TK-003",
    title: "Solicitud de nueva característica",
    client: {
      name: "Roberto García",
      email: "roberto.garcia@ejemplo.com",
    },
    status: "resolved",
    priority: "low",
    createdAt: "2023-06-10",
    assignedTo: {
      name: "Juan Pérez",
      email: "juan.perez@ejemplo.com",
    },
    lastUpdated: "2023-06-12",
  },
  {
    id: "TK-004",
    title: "Error en el panel de control",
    client: {
      name: "Ana Martínez",
      email: "ana.martinez@ejemplo.com",
    },
    status: "waiting_client",
    priority: "high",
    createdAt: "2023-06-14",
    assignedTo: {
      name: "María López",
      email: "maria.lopez@ejemplo.com",
    },
    lastUpdated: "2023-06-16",
  },
  {
    id: "TK-005",
    title: "Problema de acceso",
    client: {
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@ejemplo.com",
    },
    status: "open",
    priority: "urgent",
    createdAt: "2023-06-19",
    lastUpdated: "2023-06-19",
  },
  {
    id: "TK-006",
    title: "Solicitud de información",
    client: {
      name: "Laura Fernández",
      email: "laura.fernandez@ejemplo.com",
    },
    status: "closed",
    priority: "low",
    createdAt: "2023-06-05",
    assignedTo: {
      name: "Carlos Gómez",
      email: "carlos.gomez@ejemplo.com",
    },
    lastUpdated: "2023-06-08",
  },
  {
    id: "TK-007",
    title: "Problema con la integración",
    client: {
      name: "Pedro Sánchez",
      email: "pedro.sanchez@ejemplo.com",
    },
    status: "in_progress",
    priority: "medium",
    createdAt: "2023-06-16",
    assignedTo: {
      name: "Laura Sánchez",
      email: "laura.sanchez@ejemplo.com",
    },
    lastUpdated: "2023-06-18",
  },
  {
    id: "TK-008",
    title: "Consulta sobre precios",
    client: {
      name: "Sofía Gómez",
      email: "sofia.gomez@ejemplo.com",
    },
    status: "waiting_client",
    priority: "low",
    createdAt: "2023-06-17",
    assignedTo: {
      name: "Juan Pérez",
      email: "juan.perez@ejemplo.com",
    },
    lastUpdated: "2023-06-18",
  },
]

export function TicketsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Función para obtener la variante del badge según el estado
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "open":
        return "default"
      case "in_progress":
        return "secondary"
      case "waiting_client":
        return "warning"
      case "resolved":
        return "success"
      case "closed":
        return "outline"
      default:
        return "default"
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Abierto"
      case "in_progress":
        return "En progreso"
      case "waiting_client":
        return "Esperando cliente"
      case "resolved":
        return "Resuelto"
      case "closed":
        return "Cerrado"
      default:
        return status
    }
  }

  // Función para obtener la variante del badge según la prioridad
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "low":
        return "outline"
      case "medium":
        return "secondary"
      case "high":
        return "destructive"
      case "urgent":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Función para obtener el texto de la prioridad
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low":
        return "Baja"
      case "medium":
        return "Media"
      case "high":
        return "Alta"
      case "urgent":
        return "Urgente"
      default:
        return priority
    }
  }

  // Definición de columnas
  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    {
      accessorKey: "title",
      header: "Título",
    },
    {
      accessorKey: "client",
      header: "Cliente",
      cell: ({ row }) => {
        const client = row.original.client
        const initials = client.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt={client.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{client.name}</div>
              <div className="text-xs text-muted-foreground">{client.email}</div>
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

        return <Badge variant={getStatusVariant(status)}>{getStatusText(status)}</Badge>
      },
    },
    {
      accessorKey: "priority",
      header: "Prioridad",
      cell: ({ row }) => {
        const priority = row.original.priority

        return <Badge variant={getPriorityVariant(priority)}>{getPriorityText(priority)}</Badge>
      },
    },
    {
      accessorKey: "assignedTo",
      header: "Asignado a",
      cell: ({ row }) => {
        const assignedTo = row.original.assignedTo

        if (!assignedTo) {
          return <div className="text-muted-foreground">Sin asignar</div>
        }

        const initials = assignedTo.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder-user.jpg" alt={assignedTo.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="font-medium">{assignedTo.name}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Creado
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
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original

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
                <Link href={`/admin/tickets/${ticket.id}`} className="cursor-pointer flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ver detalles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center">
                <UserCog className="mr-2 h-4 w-4" />
                Asignar
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
          {data.length} tickets
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
