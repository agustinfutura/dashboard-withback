import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"
import Link from "next/link"

export function ClientAgentInfo() {
  // En un caso real, estos datos vendrían de una API
  const agent = {
    name: "Carlos Gómez",
    email: "carlos.gomez@ejemplo.com",
    phone: "+1 987 654 321",
    image: "/placeholder-user.jpg",
  }

  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="h-20 w-20">
        <AvatarImage src={agent.image || "/placeholder.svg"} alt={agent.name} />
        <AvatarFallback>CG</AvatarFallback>
      </Avatar>
      <h3 className="mt-4 text-lg font-medium">{agent.name}</h3>
      <p className="text-sm text-muted-foreground">Agente Comercial</p>

      <div className="mt-4 flex flex-col gap-2 w-full">
        <Button variant="outline" className="w-full justify-start">
          <Mail className="mr-2 h-4 w-4" />
          {agent.email}
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Phone className="mr-2 h-4 w-4" />
          {agent.phone}
        </Button>
      </div>

      <div className="mt-4 w-full">
        <Link href="/portal/agente">
          <Button className="w-full">Ver perfil completo</Button>
        </Link>
      </div>
    </div>
  )
}
