"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

export function ClientFilters() {
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
            <Input placeholder="Buscar por nombre, email o ID..." className="pl-8" />
          </div>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={(value) => addFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
              <SelectItem value="delinquent">Morosos</SelectItem>
              <SelectItem value="cancelled">Dados de baja</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => addFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent1">Carlos Gómez</SelectItem>
              <SelectItem value="agent2">María López</SelectItem>
              <SelectItem value="agent3">Juan Pérez</SelectItem>
              <SelectItem value="agent4">Laura Sánchez</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter === "active" && "Activos"}
              {filter === "inactive" && "Inactivos"}
              {filter === "delinquent" && "Morosos"}
              {filter === "cancelled" && "Dados de baja"}
              {filter === "agent1" && "Carlos Gómez"}
              {filter === "agent2" && "María López"}
              {filter === "agent3" && "Juan Pérez"}
              {filter === "agent4" && "Laura Sánchez"}
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
