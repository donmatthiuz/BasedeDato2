"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"
import type { Order } from "@/lib/types"

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const [isOpen, setIsOpen] = useState(false)

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
            <Link href={`/restaurants/${order.restaurant.id}`} className="font-medium text-lg hover:underline">
              {order.restaurant.name}
            </Link>
            <div className="text-sm text-muted-foreground mt-1">
              Order #{order.id.slice(-6)} • {new Date(order.date).toLocaleDateString()}
            </div>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border">
            <Image
              src={order.restaurant.image || "/placeholder.svg?height=48&width=48"}
              alt={order.restaurant.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="text-sm">
              {order.items.length} {order.items.length === 1 ? "item" : "items"} • ${order.total.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {order.status === "completed" ? "Delivered" : "Estimated delivery"}: {order.deliveryTime}
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
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{item.quantity}x</div>
                    <div>{item.name}</div>
                  </div>
                  <div>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}

              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <div>Subtotal</div>
                  <div>${order.subtotal.toFixed(2)}</div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>Delivery Fee</div>
                  <div>${order.deliveryFee.toFixed(2)}</div>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <div>Discount</div>
                    <div>-${order.discount.toFixed(2)}</div>
                  </div>
                )}
                <div className="flex justify-between font-medium pt-1">
                  <div>Total</div>
                  <div>${order.total.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {order.status === "completed" && !order.reviewed && (
          <Link href={`/restaurants/${order.restaurant.id}/review?orderId=${order.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Write a Review
            </Button>
          </Link>
        )}

        {order.status !== "cancelled" && order.status !== "completed" && (
          <Button variant="outline" className="flex-1">
            Track Order
          </Button>
        )}

        <Link href={`/orders/${order.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            Order Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
