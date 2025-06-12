"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface MainNavProps {
  isAdmin: boolean
}

export function MainNav({ isAdmin }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm">
      {isAdmin ? (
        <>
          <Link
            href="/admin/dashboard"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/admin/dashboard" ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/clientes"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname.startsWith("/admin/clientes") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Clientes
          </Link>
          <Link
            href="/admin/finanzas"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname.startsWith("/admin/finanzas") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Finanzas
          </Link>
          <Link
            href="/admin/tickets"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname.startsWith("/admin/tickets") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Tickets
          </Link>
          <Link
            href="/admin/documentos"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname.startsWith("/admin/documentos") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Documentos
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/portal/dashboard"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/portal/dashboard" ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/portal/suscripciones"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname.startsWith("/portal/suscripciones") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Suscripciones
          </Link>
          <Link
            href="/portal/pagos"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname.startsWith("/portal/pagos") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Pagos
          </Link>
          <Link
            href="/portal/tickets"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname.startsWith("/portal/tickets") ? "text-foreground font-medium" : "text-foreground/60",
            )}
          >
            Soporte
          </Link>
        </>
      )}
    </nav>
  )
}
