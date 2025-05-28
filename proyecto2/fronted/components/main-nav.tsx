"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"
import { Badge } from "@/components/ui/badge"
import useID from "@/hooks/useID"
import { useEffect, useState } from "react"
import useApi from "@/hooks/useApi"
import source_link from "@/repositori/source_repo"
import { useOrdenUpdater } from "@/hooks/useOrdenUpdater"

export function MainNav() {
  const { userID, setUserID } = useID();
  const pathname = usePathname()
  const { totalItems } = useCart()

  const [cantidad_car, setCantidadcar] = useState(0)
  const {llamado_whit_link: getordenes} = useApi(``)

  const {llamado_whit_link: getcliente} = useApi(``)

  const [rol, setRol] = useState('')

  const get_mi_rol = async () => {
    if (userID) {
      const response = await getcliente(`${source_link}/api/usuario?_id=${userID}&limit=5`, "GET")
      const response_ordenes = await getordenes(`${source_link}/api/orden?usuario_id=${userID}&estado=pendiente`, "GET")
  
      const totalCantidad = response_ordenes.reduce((acc: number, orden: { platillos: any[] }) => {
        const sumaPlatillos = orden.platillos.reduce((sum, platillo) => sum + platillo.cantidad, 0)
        return acc + sumaPlatillos
      }, 0)
  
      setCantidadcar(totalCantidad)
      setRol(response[0].tipo)
    } else {
      setRol('')
    }
  }

  
  useEffect(() => {
    
    
    

    get_mi_rol();

  }, [userID, pathname])

  useOrdenUpdater(() => {
    get_mi_rol()
  })
  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    // {
    //   href: "/restaurants",
    //   label: "Restaurants",
    //   active: pathname === "/restaurants",
    // },
    
     ...(rol === "restaurante"
    ? [
        {
          href: "/restaurante_dash",
          label: "Dashboard Restaurante",
          active: pathname === "/restaurante_dash",
        },
      ]
    : []),


    ,...(!userID
      ? [
          {
            href: "/login",
            label: "Iniciar Sesión",
            active: pathname === "/login",
          },
        ]
      : [
          {
            href: "/logout",
            label: "Salir de Cuenta",
            active: pathname === "/logout",
          },
        ]),




    
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`${route.active ? "text-foreground" : "text-muted-foreground"} hover:text-foreground`}
                >
                  {route.label}
                </Link>
              ))}
              
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl">FoodHub</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`${route.active ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
            >
              {route.label}
            </Link>
          ))}
          
        </nav>

        <div className="hidden md:flex ml-auto items-center space-x-4">
        <span className="font-bold text-xl">{rol}</span>
          <div className="relative w-full max-w-sm">
            
            <Input type="search" placeholder="Search restaurants or dishes..." className="pl-8" />
            
          </div>

          {rol === "cliente" && (
            <Link href="/orders">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cantidad_car > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cantidad_car}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          )}


         
        </div>

        <div className="flex md:hidden ml-auto items-center space-x-4">
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
