import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRated } from "@/lib/data"
interface Restaurante {
  _id: string;
  nombre: string;
  categoria: string;
  direccion: string;
  coordenadas: {
    type: "Point";
    coordinates: [number, number]; // [longitud, latitud]
  };
  telefono: string;
}


interface RestaurantCardProps {
  restaurant: Restaurante
}

export async function RestaurantCard({ restaurant }: RestaurantCardProps) {

  const resenas = await getRated()
  const resumen = resenas.find(r => r.restaurante_id === restaurant._id);
  const promedio = resumen?.promedio_calificacion ?? 0;
 
  return (
    <Link href={`/restaurants/${restaurant._id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-1">{restaurant.nombre}</h3>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{promedio.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{restaurant.categoria}</p>
          <div className="flex gap-2 mt-2">
           
              <Badge  variant="outline" className="text-xs">
                {restaurant.telefono}
              </Badge>
           
          </div>
        </CardContent>
        {/* <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
          {restaurant.deliveryTime} min •{" "}
          {restaurant.deliveryFee ? `$${restaurant.deliveryFee.toFixed(2)} delivery` : "Free delivery"}
        </CardFooter> */}
      </Card>
    </Link>
  )
}
