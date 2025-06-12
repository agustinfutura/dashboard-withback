import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText } from "lucide-react"

export function ClientDocumentsList() {
  // En un caso real, estos datos vendrían de una API
  const documents = [
    {
      id: "DOC-001",
      name: "Contrato de Servicio",
      type: "CONTRACT",
      createdAt: "2023-01-15",
      size: "1.2 MB",
    },
    {
      id: "DOC-002",
      name: "Factura - Enero 2023",
      type: "INVOICE",
      createdAt: "2023-01-20",
      size: "245 KB",
    },
    {
      id: "DOC-003",
      name: "Factura - Febrero 2023",
      type: "INVOICE",
      createdAt: "2023-02-20",
      size: "250 KB",
    },
    {
      id: "DOC-004",
      name: "Factura - Marzo 2023",
      type: "INVOICE",
      createdAt: "2023-03-20",
      size: "248 KB",
    },
    {
      id: "DOC-005",
      name: "Factura - Abril 2023",
      type: "INVOICE",
      createdAt: "2023-04-20",
      size: "252 KB",
    },
    {
      id: "DOC-006",
      name: "Factura - Mayo 2023",
      type: "INVOICE",
      createdAt: "2023-05-20",
      size: "247 KB",
    },
    {
      id: "DOC-007",
      name: "Factura - Junio 2023",
      type: "INVOICE",
      createdAt: "2023-06-20",
      size: "251 KB",
    },
    {
      id: "DOC-008",
      name: "Manual de Usuario",
      type: "OTHER",
      createdAt: "2023-01-18",
      size: "3.5 MB",
    },
  ]

  // Función para obtener el texto del tipo de documento
  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case "CONTRACT":
        return "Contrato"
      case "INVOICE":
        return "Factura"
      case "REPORT":
        return "Reporte"
      case "LEGAL":
        return "Legal"
      case "OTHER":
        return "Otro"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
        <CardDescription>Documentos disponibles para descarga</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {document.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getDocumentTypeText(document.type)}</Badge>
                </TableCell>
                <TableCell>{new Date(document.createdAt).toLocaleDateString("es-ES")}</TableCell>
                <TableCell>{document.size}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
