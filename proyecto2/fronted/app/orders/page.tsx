"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderCard } from "@/components/order-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserOrders } from "@/lib/data"
import useID from "@/hooks/useID"
import useApi from "@/hooks/useApi"
import source_link from "@/repositori/source_repo"


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
  fecha: string; // o Date si la parseas
  estado: string;
  platillos: Platillo[];
  total: number;
}


export default function OrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
    const status = (searchParams.status as string) || "all"

    

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        
      </div>

      <Tabs defaultValue={status} className="w-full">
        <Suspense fallback={<OrdersLoadingSkeleton />}>
          <OrdersList status={status} />
        </Suspense>
      </Tabs>
    </div>
  )
}

function OrdersList({ status }: { status: string }) {
  const [orders, setOrders] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const { userID, setUserID } = useID();
  const {llamado_whit_link: getordenes} = useApi(``)


  const {llamado: orden_seted } = useApi(`${source_link}/api/orden`)

  const pay = async() =>{

    for (const orden of orders) {
      await orden_seted(
        {
          _id: orden._id,
          estado: "completada",
          platillos: orden.platillos
        },
        "PATCH"
      );
    }

     window.location.href = "/orders"

  }

  useEffect(() => {
      
    const getOrdenes_d = async() => {
      if (userID) {
        const response = await getordenes(`${source_link}/api/orden?usuario_id=${userID}&estado=pendiente`,"GET")

        console.log(response)

        setOrders(response)

        setLoading(false)

      } else {

        
        
      }
    }

    getOrdenes_d();

  }, [userID])

  if (loading) return <OrdersLoadingSkeleton />;

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        
        <h2 className="text-xl font-medium mb-2">No orders found</h2>
        <p className="text-muted-foreground mb-4">
          {status === "all" ? "You haven't placed any orders yet" : `You don't have any ${status} orders`}
        </p>
        <Link href="/restaurants">
          <Button>Browse Restaurants</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button onClick={pay}>Pagar todo</Button>
      {orders.map((order) => (
        <OrderCard  
          key={order._id}
        orden={order} />
      ))}
    </div>
  );
}


function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
    </div>
  )
}
