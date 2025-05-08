"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"
import source_link from "@/repositori/source_repo"
import useApi from "@/hooks/useApi"

interface Platillo {
  menu_item_id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
}

interface Orden {
  _id: string;
  usuario_id: string;
  restaurante_id: string;
  fecha: string;
  estado: string;
  platillos: Platillo[];
  total: number;
}

interface OrderCardProps {
  orden: Orden;
  restauranteNombre?: string;
  restauranteImagen?: string;
  deliveryTime?: string; // opcional si lo tienes
}

export function OrderCard({ orden, restauranteNombre = "Restaurante", restauranteImagen = "/placeholder.svg", deliveryTime = "45 min" }: OrderCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {llamado_whit_link: getName} = useApi(``)
  const [nombreres, setNombreres] = useState('')
  useEffect(() => {
      
    const nombre_restaurante = async() => {
     
      const response = await getName(`${source_link}/api/restaurante?_id=${orden.restaurante_id}`,"GET")
      
      let nombre = response[0].nombre

      setNombreres(nombre)
       

      
    }

    nombre_restaurante();

  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-yellow-100 text-yellow-800"
      case "delivering":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-lg">
              {nombreres}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Order #{orden._id.slice(-6)} • {new Date(orden.fecha).toLocaleDateString()}
            </div>
          </div>
          <Badge className={getStatusColor(orden.estado)}>
            {orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border">
            <Image
              src={restauranteImagen}
              alt={restauranteNombre}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="text-sm">
              {orden.platillos.length} {orden.platillos.length === 1 ? "item" : "items"} • Q{orden.total.toFixed(2)}
            </div>
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              {isOpen ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  View details
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 space-y-3 border-t pt-3">
              {orden.platillos.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{item.cantidad}x</div>
                    <div>{item.nombre}</div>
                  </div>
                  <div>Q{((item.precio ?? item.precio_unitario) * item.cantidad).toFixed(2)}</div>
                </div>
              ))}

              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between font-medium pt-1">
                  <div>Total</div>
                  <div>Q{orden.total.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {/* Si deseas agregar botón de reseña u otras acciones, puedes hacerlo aquí */}
      </CardFooter>
    </Card>
  )
}
