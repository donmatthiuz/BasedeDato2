"use client"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, DollarSign, Phone } from "lucide-react"
import { RestaurantMenu } from "@/components/restaurant-menu"
import { RestaurantReviews } from "@/components/restaurant-reviews"
import { getRestaurantById } from "@/lib/data"
import { useEffect, useState } from "react"
import useApi from "@/hooks/useApi"
import source_link from "@/repositori/source_repo"

export default function RestaurantPage({ params }: { params: { id: string } }) {
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

  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const {llamado_whit_link: getResta} = useApi(``)
  const [promedio, setPromedio] = useState(0)

  const [count, setCount] = useState(0)
  useEffect(() => {
    
    const getretaurante = async() => {
      
        const response = await getResta(`${source_link}/api/restaurante?_id=${params.id}`,"GET")
        const response_rate = await getResta(`${source_link}/api/resena/promedios?ordenar=asc&ordenar_por=promedio_calificacion`
          ,"GET")
        setRestaurante(response[0])
        console.log(response_rate)
        const resumen = response_rate.find(r => r.restaurante_id === params.id);

        const promedio = resumen?.promedio_calificacion ?? 0;

        const total = resumen?.total_resenas ?? 0;
        setCount(total)

        setPromedio(promedio)


        

     }

     getretaurante();

  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-6">
      
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{restaurante?.nombre}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {promedio.toFixed(1)}  ({count} reviews)
            </Badge>
            {/* <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {restaurant.deliveryTime} min
            </Badge> */}
            {/* <Badge variant="outline">{restaurant.cuisine}</Badge>
            {restaurant.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))} */}
          </div>
          <div className="flex items-center gap-2 mt-3 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{restaurante?.direccion}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{restaurante?.telefono}</span>
          </div>
        </div>

        
      </div>

      <Tabs defaultValue="menu">
        <TabsList className="mb-6">
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
         
        </TabsList>
        <TabsContent value="reviews">
          <RestaurantReviews restaurantId={params.id} />
        </TabsContent>
        <TabsContent value="menu">
          <RestaurantMenu restaurantId={params.id} />
        </TabsContent>
        {/* <TabsContent value="menu">
          <RestaurantMenu restaurantId={restaurant.id} />
        </TabsContent>

        <TabsContent value="reviews">
          <RestaurantReviews restaurantId={restaurant.id} />
        </TabsContent>

        <TabsContent value="info">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="text-muted-foreground">{restaurant.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Hours</h3>
              <ul className="space-y-1 text-muted-foreground">
                {restaurant.hours.map((hour, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{hour.day}</span>
                    <span>
                      {hour.open} - {hour.close}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Price Range</h3>
              <div className="flex items-center">
                {Array(restaurant.priceLevel)
                  .fill(0)
                  .map((_, i) => (
                    <DollarSign key={i} className="h-4 w-4 text-green-600" />
                  ))}
                {Array(4 - restaurant.priceLevel)
                  .fill(0)
                  .map((_, i) => (
                    <DollarSign key={i} className="h-4 w-4 text-muted-foreground opacity-30" />
                  ))}
              </div>
            </div>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
