

import Link from "next/link"
import { RestaurantCard } from "@/components/restaurant-card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getMenus, getTopRestaurants } from "@/lib/data"
import { MenuItem_Card } from "@/components/menu-item"
// import { useEffect, useState } from "react"
// import useApi from "@/hooks/useApi"
import source_link from "@/repositori/source_repo"

interface MenuItem {
  _id: string
  nombre: string
  precio: number
  descripcion: string
  disponible: boolean
  restaurante_id: string
  imagen_id: string
}



export default async function Home() {
  const topRestaurants = await getTopRestaurants()

  const menus = await getMenus();
  // const {llamado_whit_link: getMenus} = useApi(``)
  // const [menus, setMenus] = useState<MenuItem[]>([])

  // useEffect(() => {
    
  //   const getmenus = async() => {
      
  //       const response = await getMenus(`${source_link}/api/menu`,"GET")

  //       setMenus(response)

        

  //    }

  //   getmenus();

  // }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-16 lg:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Discover and Order from the Best Restaurants
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find your favorite restaurants, place orders, and share your experiences with others.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search restaurants..." className="pl-9" />
            </div>
            <Button size="lg">Buscar Platos</Button>
          </div>
        </div>
      </section>
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Top Rated Restaurants</h2>
          <Link href="/restaurants">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRestaurants.map((restaurant) => (
            <RestaurantCard 
            
            key={restaurant._id}
            restaurant={restaurant} />
          ))}
        </div>
      </section>
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Top Menus mas vendidos</h2>
          <Link href="/restaurants">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((item) => (
            <MenuItem_Card
            key={item._id}
            menu={item}
            
          />
          ))}
        </div>
      </section>




      <section className="py-8">
        {/* <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Cuisines</h2>
        </div> */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Italian", "Japanese", "Mexican", "Indian"].map((cuisine) => (
            <Link
              key={cuisine}
              href={`/restaurants?cuisine=${cuisine.toLowerCase()}`}
              className="bg-muted rounded-lg p-6 text-center hover:bg-muted/80 transition-colors"
            >
              <h3 className="font-medium text-lg">{cuisine}</h3>
            </Link>
          ))}
        </div> */}
      </section>
    </div>
  )
}
