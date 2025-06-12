"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

export function TicketFilters() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por título, ID o cliente..." className="pl-8" />
          </div>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={(value) => addFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Abiertos</SelectItem>
              <SelectItem value="in_progress">En progreso</SelectItem>
              <SelectItem value="waiting_client">Esperando cliente</SelectItem>
              <SelectItem value="resolved">Resueltos</SelectItem>
              <SelectItem value="closed">Cerrados</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => addFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => addFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Asignado a" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent1">Carlos Gómez</SelectItem>
              <SelectItem value="agent2">María López</SelectItem>
              <SelectItem value="agent3">Juan Pérez</SelectItem>
              <SelectItem value="agent4">Laura Sánchez</SelectItem>
              <SelectItem value="unassigned">Sin asignar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter === "open" && "Abiertos"}
              {filter === "in_progress" && "En progreso"}
              {filter === "waiting_client" && "Esperando cliente"}
              {filter === "resolved" && "Resueltos"}
              {filter === "closed" && "Cerrados"}
              {filter === "low" && "Prioridad: Baja"}
              {filter === "medium" && "Prioridad: Media"}
              {filter === "high" && "Prioridad: Alta"}
              {filter === "urgent" && "Prioridad: Urgente"}
              {filter === "agent1" && "Asignado a: Carlos Gómez"}
              {filter === "agent2" && "Asignado a: María López"}
              {filter === "agent3" && "Asignado a: Juan Pérez"}
              {filter === "agent4" && "Asignado a: Laura Sánchez"}
              {filter === "unassigned" && "Sin asignar"}
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter(filter)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setActiveFilters([])}>
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
