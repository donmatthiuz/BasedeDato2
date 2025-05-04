import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderCard } from "@/components/order-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserOrders } from "@/lib/data"

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
        <Link href="/restaurants">
          <Button>Order Food</Button>
        </Link>
      </div>

      <Tabs defaultValue={status} className="w-full">
        <Suspense fallback={<OrdersLoadingSkeleton />}>
          <OrdersList status={status} />
        </Suspense>
      </Tabs>
    </div>
  )
}

async function OrdersList({ status }: { status: string }) {
  const orders = await getUserOrders(status)

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
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
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
