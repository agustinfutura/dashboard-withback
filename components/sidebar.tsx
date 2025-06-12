"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Users, CreditCard, FileBadge, LifeBuoy, User, Receipt, FileBox, Calendar } from "lucide-react"

interface SidebarProps {
  isAdmin: boolean
  className?: string
}

export function Sidebar({ isAdmin, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("space-y-4 py-4", className)}>
      <div className="px-4 py-2">
        <h2 className="mb-2 px-2 text-lg font-semibold">{isAdmin ? "Administración" : "Portal de Cliente"}</h2>
        <div className="space-y-1">
          {isAdmin ? (
            // Menú para administradores
            <>
              <Link
                href="/admin/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname === "/admin/dashboard"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/clientes"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/admin/clientes")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Users className="h-4 w-4" />
                Clientes
              </Link>
              <Link
                href="/admin/finanzas"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/admin/finanzas")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <CreditCard className="h-4 w-4" />
                Finanzas
              </Link>
              <Link
                href="/admin/pagos"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/admin/pagos")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Receipt className="h-4 w-4" />
                Planes de Pago
              </Link>
              <Link
                href="/admin/reportes"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/admin/reportes")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <FileBadge className="h-4 w-4" />
                Reportes
              </Link>
              <Link
                href="/admin/documentos"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/admin/documentos")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <FileBox className="h-4 w-4" />
                Documentos
              </Link>
              <Link
                href="/admin/tickets"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/admin/tickets")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <LifeBuoy className="h-4 w-4" />
                Tickets
              </Link>
              <Link
                href="/admin/agenda"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/admin/agenda")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Calendar className="h-4 w-4" />
                Agenda
              </Link>
            </>
          ) : (
            // Menú para clientes
            <>
              <Link
                href="/portal/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname === "/portal/dashboard"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/portal/suscripciones"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/portal/suscripciones")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Receipt className="h-4 w-4" />
                Suscripciones
              </Link>
              <Link
                href="/portal/pagos"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/portal/pagos")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <CreditCard className="h-4 w-4" />
                Pagos
              </Link>
              <Link
                href="/portal/documentos"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/portal/documentos")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <FileBox className="h-4 w-4" />
                Documentos
              </Link>
              <Link
                href="/portal/tickets"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/portal/tickets")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <LifeBuoy className="h-4 w-4" />
                Soporte
              </Link>
              <Link
                href="/portal/agente"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname.startsWith("/portal/agente")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <User className="h-4 w-4" />
                Mi Agente
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
