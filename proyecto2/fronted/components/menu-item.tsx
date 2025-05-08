"use client"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button" // Asegúrate de tener este componente
import { CarIcon, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import useApi from "@/hooks/useApi"
import source_link from "@/repositori/source_repo"
import useID from "@/hooks/useID"
import { triggerOrdenUpdate } from "@/hooks/useOrdenUpdater"

interface MenuItem {
  _id: string
  nombre: string
  precio: number
  descripcion: string
  disponible: boolean
  restaurante_id: string
  imagen_id: string
}

interface MenuItCardProps {
  menu: MenuItem
  
}

export function MenuItem_Card({ menu }: MenuItCardProps) {

  const {llamado_whit_link: getImagenes} = useApi(``)
  const {llamado: postOrden} = useApi(`${source_link}/api/orden`)
  const [imagen, setImagen] = useState(null)
  const { userID, setUserID } = useID();
  const {llamado_whit_link: getordenes} = useApi(``)
  
  useEffect(() => {
    
    const getImage = async() => {
      const response = await getImagenes(`${source_link}/api/menu/${menu._id}/imagen`,"GET")

      setImagen(response)


    }

    getImage();

  }, [])


  const onAdd_Menu = async() => {

    const response = await getordenes(`${source_link}/api/orden?usuario_id=${userID}&restaurante_id=${menu.restaurante_id}&estado=pendiente`,"GET")

    

    if (response.length === 0){

      const response = await  postOrden({
        usuario_id: userID,
        restaurante_id: menu.restaurante_id,
        estado: "pendiente",
        fecha: new Date().toISOString(),
        platillos: [
          {
            nombre: menu.nombre,
            descripcion: menu.descripcion,
            precio: menu.precio,
            cantidad: 1
          }
        ]

      }, "POST")

      console.log(response)


      
       
      

    }else{
      // si tiene el restaurante y ya hizo pedidos aqui
      const platillo = response[0].platillos.find(p => p.nombre === menu.nombre);
      let nuevosPlatillos;


      //si uno de los que agregue tiene el nombre del menu seleccionado, solo le sumo a ese platillo 1 y envio denuevo todos los platillos	
      if (platillo){
        nuevosPlatillos = response[0].platillos.map(p => {
          if (p.nombre === menu.nombre) {
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
            nombre: menu.nombre,
            descripcion: menu.descripcion,
            precio: menu.precio,
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
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={`${source_link}/api/menu/${menu._id}/imagen` || "/placeholder.svg?height=192&width=384"}
          alt={menu._id}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{menu.nombre}</h3>
          <span className="text-sm font-medium text-green-500">Q {menu.precio}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{menu.descripcion}</p>
        <Button onClick={onAdd_Menu} className="w-full">
          Agregar
          <ShoppingCart/>
        </Button>
      </CardFooter>
    </Card>
  )
}
