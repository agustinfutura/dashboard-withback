import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, BarChart3, Users, CreditCard, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            <span className="text-lg font-bold">Sistema de Administración</span>
          </Link>
        </div>
        <nav className="ml-auto flex gap-4">
          <Link href="/login" className="font-medium">
            <Button variant="outline">Iniciar Sesión</Button>
          </Link>
          <Link href="/registro" className="font-medium">
            <Button>Registrarse</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Sistema Completo de Administración y Portal de Clientes
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Gestiona tus clientes, finanzas y soporte técnico desde un único lugar. Nuestra plataforma integrada
                  facilita el seguimiento de todos los aspectos de tu negocio.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="gap-2">
                      Comenzar ahora <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg">
                      Conoce más
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-xl border bg-background p-6 shadow-lg">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold">Dashboard Intuitivo</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Visualiza el desempeño de tu negocio con gráficos y métricas en tiempo real
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Características</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Todo lo que necesitas</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nuestra plataforma ofrece herramientas completas para la gestión de tu negocio, desde el seguimiento
                  de clientes hasta la administración financiera.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Gestión de Clientes</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Administra de forma eficiente la información de tus clientes, asigna agentes y realiza un seguimiento
                  completo.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Gestión Financiera</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Controla ingresos, gastos, suscripciones y planes de pago con herramientas avanzadas de seguimiento.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Reportes y Análisis</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Genera informes detallados sobre el rendimiento de tu negocio y toma decisiones basadas en datos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:gap-8 md:px-6">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2024 Sistema de Administración. Todos los derechos reservados.
          </p>
          <nav className="flex gap-4">
            <Link href="/terminos" className="text-sm text-muted-foreground hover:underline">
              Términos
            </Link>
            <Link href="/privacidad" className="text-sm text-muted-foreground hover:underline">
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
