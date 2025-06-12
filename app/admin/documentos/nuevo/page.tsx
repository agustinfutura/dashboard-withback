"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

export default function NewDocumentPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<string>("")
  const [clientId, setClientId] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // En un caso real, aquí se enviaría el formulario a la API
    console.log("Enviando formulario:", { documentType, clientId, selectedFile })
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/documentos">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Nuevo Documento</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Subir Documento</CardTitle>
            <CardDescription>
              Completa la información y sube el archivo para crear un nuevo documento en el sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del documento</Label>
              <Input id="name" placeholder="Ej: Contrato de Servicio - Cliente X" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Textarea id="description" placeholder="Breve descripción del documento..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de documento</Label>
                <Select onValueChange={setDocumentType} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONTRACT">Contrato</SelectItem>
                    <SelectItem value="INVOICE">Factura</SelectItem>
                    <SelectItem value="REPORT">Reporte</SelectItem>
                    <SelectItem value="LEGAL">Documento Legal</SelectItem>
                    <SelectItem value="OTHER">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Cliente (opcional)</Label>
                <Select onValueChange={setClientId}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client1">Juan Pérez</SelectItem>
                    <SelectItem value="client2">María López</SelectItem>
                    <SelectItem value="client3">Roberto García</SelectItem>
                    <SelectItem value="client4">Ana Martínez</SelectItem>
                    <SelectItem value="client5">Carlos Rodríguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Archivo</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arrastra y suelta un archivo aquí, o haz clic para seleccionar
                </p>
                <Input id="file" type="file" className="hidden" onChange={handleFileChange} required />
                <Button type="button" variant="outline" onClick={() => document.getElementById("file")?.click()}>
                  Seleccionar archivo
                </Button>
                {selectedFile && (
                  <p className="text-sm mt-2">
                    Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/documentos">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit">Subir documento</Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  )
}
