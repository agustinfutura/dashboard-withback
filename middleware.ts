import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = !!token

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/", "/login", "/registro", "/recuperar-contrasena"]

  // Rutas de administración que requieren rol de administrador
  const adminRoutes = ["/admin"]

  // Rutas de agente que requieren rol de administrador o agente
  const agentRoutes = ["/agente"]

  // Obtener la ruta actual
  const path = req.nextUrl.pathname

  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))

  // Verificar si la ruta actual es de administración
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))

  // Verificar si la ruta actual es de agente
  const isAgentRoute = agentRoutes.some((route) => path.startsWith(route))

  // Si la ruta es pública, permitir el acceso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Si no está autenticado y la ruta no es pública, redirigir al login
  if (!isAuthenticated) {
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", encodeURI(req.url))
    return NextResponse.redirect(url)
  }

  // Si está autenticado pero intenta acceder a una ruta de administración sin ser administrador
  if (isAdminRoute && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/portal/dashboard", req.url))
  }

  // Si está autenticado pero intenta acceder a una ruta de agente sin ser administrador o agente
  if (isAgentRoute && token.role !== "ADMIN" && token.role !== "AGENT") {
    return NextResponse.redirect(new URL("/portal/dashboard", req.url))
  }

  // Si está autenticado y es un cliente intentando acceder a la raíz, redirigir al dashboard del portal
  if (path === "/" && isAuthenticated && token.role === "USER") {
    return NextResponse.redirect(new URL("/portal/dashboard", req.url))
  }

  // Si está autenticado y es un administrador intentando acceder a la raíz, redirigir al dashboard de administración
  if (path === "/" && isAuthenticated && token.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url))
  }

  // Si está autenticado y es un agente intentando acceder a la raíz, redirigir al dashboard de agente
  if (path === "/" && isAuthenticated && token.role === "AGENT") {
    return NextResponse.redirect(new URL("/agente/dashboard", req.url))
  }

  // En cualquier otro caso, permitir el acceso
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
