"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { PaperclipIcon, SendIcon } from "lucide-react"

interface TicketConversationProps {
  ticketId: string
}

interface Message {
  id: string
  content: string
  sender: {
    name: string
    email: string
    role: "client" | "agent" | "system"
  }
  timestamp: string
  isInternal: boolean
  attachments?: {
    name: string
    url: string
    size: string
  }[]
}

export function TicketConversation({ ticketId }: TicketConversationProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isInternal, setIsInternal] = useState(false)

  // En un caso real, estos datos vendrían de una API
  const messages: Message[] = [
    {
      id: "MSG-001",
      content:
        "No he recibido la factura del mes pasado y necesito para mis registros contables. ¿Podrían enviarla nuevamente?",
      sender: {
        name: "Juan Pérez",
        email: "juan.perez@ejemplo.com",
        role: "client",
      },
      timestamp: "2023-06-18T10:30:00",
      isInternal: false,
    },
    {
      id: "MSG-002",
      content:
        "Hola Juan, gracias por contactarnos. Voy a revisar el estado de tu factura y te responderé a la brevedad.",
      sender: {
        name: "Laura Sánchez",
        email: "laura.sanchez@ejemplo.com",
        role: "agent",
      },
      timestamp: "2023-06-18T11:15:00",
      isInternal: false,
    },
    {
      id: "MSG-003",
      content:
        "He revisado en el sistema y parece que hubo un problema con el envío automático. Voy a reenviarla manualmente.",
      sender: {
        name: "Laura Sánchez",
        email: "laura.sanchez@ejemplo.com",
        role: "agent",
      },
      timestamp: "2023-06-18T11:30:00",
      isInternal: true,
    },
    {
      id: "MSG-004",
      content: "Ticket asignado a Laura Sánchez",
      sender: {
        name: "Sistema",
        email: "",
        role: "system",
      },
      timestamp: "2023-06-18T11:00:00",
      isInternal: true,
    },
    {
      id: "MSG-005",
      content:
        "Hola Juan, acabo de reenviar la factura a tu correo electrónico. Por favor, verifica si la has recibido correctamente. Adjunto también una copia en este mensaje.",
      sender: {
        name: "Laura Sánchez",
        email: "laura.sanchez@ejemplo.com",
        role: "agent",
      },
      timestamp: "2023-06-19T09:45:00",
      isInternal: false,
      attachments: [
        {
          name: "Factura-Mayo-2023.pdf",
          url: "#",
          size: "245 KB",
        },
      ],
    },
  ]

  // Ordenar mensajes por fecha
  const sortedMessages = [...messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Obtener iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // En un caso real, aquí se enviaría el mensaje a la API
    console.log("Enviando mensaje:", { content: newMessage, isInternal })
    setNewMessage("")
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Conversación</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-4">
        {sortedMessages.map((message) => (
          <div key={message.id} className={`flex gap-4 ${message.isInternal ? "bg-muted/50 p-4 rounded-lg" : ""}`}>
            {message.sender.role === "system" ? (
              <div className="w-full text-center text-sm text-muted-foreground py-2">{message.content}</div>
            ) : (
              <>
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt={message.sender.name} />
                  <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.sender.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(message.timestamp)}</span>
                    {message.isInternal && <Badge variant="outline">Nota interna</Badge>}
                  </div>
                  <div className="text-sm">{message.content}</div>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="pt-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                          <a href={attachment.url} className="text-primary hover:underline">
                            {attachment.name}
                          </a>
                          <span className="text-xs text-muted-foreground">({attachment.size})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full space-y-2">
          <Textarea
            placeholder="Escribe tu respuesta..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="internal"
                checked={isInternal}
                onCheckedChange={(checked) => setIsInternal(checked as boolean)}
              />
              <label
                htmlFor="internal"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Nota interna
              </label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" type="button">
                <PaperclipIcon className="h-4 w-4 mr-2" />
                Adjuntar
              </Button>
              <Button type="submit" disabled={!newMessage.trim()}>
                <SendIcon className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </form>
      </CardFooter>
    </Card>
  )
}
