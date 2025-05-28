"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/use-cart"
import { getMenuByRestaurantId } from "@/lib/data"

import useApi from "@/hooks/useApi"
import source_link from "@/repositori/source_repo"
import { triggerOrdenUpdate } from "@/hooks/useOrdenUpdater"
import useID from "@/hooks/useID"
interface MenuItem {
  _id: string
  nombre: string
  precio: number
  descripcion: string
  disponible: boolean
  restaurante_id: string
  imagen_id: string
}

interface RestaurantMenuProps {
  restaurantId: string
}

export function RestaurantMenu({ restaurantId }: RestaurantMenuProps) {
  const {llamado_whit_link: getmenus} = useApi(``)
  const [menus_is, setMenusIS] = useState<MenuItem[]>([])


  
  
  
  
  
  useEffect(() => {
    
    const getretaurante = async() => {
      
        const response = await getmenus(`${source_link}/api/menu?restaurante_id=${restaurantId}`,"GET")

        setMenusIS(response)
        
        


        

     }

     getretaurante();

  }, [])

  return (
    <div>
      <Tabs >
       

        {menus_is.map((mn) => (
          <MenuItemCard key={mn._id} item={mn} />
        ))}
      </Tabs>
    </div>
  )
}

function MenuItemCard({ item}: { item: MenuItem }) {

  const {llamado: postOrden} = useApi(`${source_link}/api/orden`)
  const {llamado_whit_link: getordenes} = useApi(``)
  const { userID, setUserID } = useID();
  
  const onAdd_Menu = async() => {

    const response = await getordenes(`${source_link}/api/orden?usuario_id=${userID}&restaurante_id=${item.restaurante_id}&estado=pendiente`,"GET")

    

    if (response.length === 0){

      const response = await  postOrden({
        usuario_id: userID,
        restaurante_id: item.restaurante_id,
        estado: "pendiente",
        fecha: new Date().toISOString(),
        platillos: [
          {
            nombre: item.nombre,
            descripcion: item.descripcion,
            precio: item.precio,
            cantidad: 1
          }
        ]

      }, "POST")

      console.log(response)


      
       
      

    }else{
      // si tiene el restaurante y ya hizo pedidos aqui
      const platillo = response[0].platillos.find(p => p.nombre === item.nombre);
      let nuevosPlatillos;


      //si uno de los que agregue tiene el nombre del menu seleccionado, solo le sumo a ese platillo 1 y envio denuevo todos los platillos	
      if (platillo){
        nuevosPlatillos = response[0].platillos.map(p => {
          if (p.nombre === item.nombre) {
            return { ...p, cantidad: p.cantidad + 1 };
          }
          return p;
        });
      }
      //sino entonces creo un nuevo platillo y lo agrego
      else {
        nuevosPlatillos = [
          ...response[0].platillos,
          {
            nombre: item.nombre,
            descripcion: item.descripcion,
            precio: item.precio,
            cantidad: 1
          }
        ];
       
      }

      const insert_platillo = await postOrden(
        {
          _id: response[0]._id,
          estado: "pendiente",
          platillos: nuevosPlatillos
        },
        "PATCH"
      );
      
    }

    triggerOrdenUpdate()




  }

  return (
    <Card>
      <CardContent className="p-4 flex gap-4">
        

        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">{item.nombre}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.descripcion}</p>
            </div>
            <div className="text-right">
              <div className="font-medium">Q{item.precio.toFixed(2)}</div>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full mt-2" onClick={onAdd_Menu}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add to cart</span>
              </Button>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
