"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

export function DocumentFilters() {
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
            <Input placeholder="Buscar por nombre o descripción..." className="pl-8" />
          </div>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={(value) => addFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contract">Contratos</SelectItem>
              <SelectItem value="invoice">Facturas</SelectItem>
              <SelectItem value="report">Reportes</SelectItem>
              <SelectItem value="legal">Documentos Legales</SelectItem>
              <SelectItem value="other">Otros</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => addFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client1">Juan Pérez</SelectItem>
              <SelectItem value="client2">María López</SelectItem>
              <SelectItem value="client3">Roberto García</SelectItem>
              <SelectItem value="client4">Ana Martínez</SelectItem>
              <SelectItem value="no_client">Sin cliente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter === "contract" && "Contratos"}
              {filter === "invoice" && "Facturas"}
              {filter === "report" && "Reportes"}
              {filter === "legal" && "Documentos Legales"}
              {filter === "other" && "Otros"}
              {filter === "client1" && "Cliente: Juan Pérez"}
              {filter === "client2" && "Cliente: María López"}
              {filter === "client3" && "Cliente: Roberto García"}
              {filter === "client4" && "Cliente: Ana Martínez"}
              {filter === "no_client" && "Sin cliente"}
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
