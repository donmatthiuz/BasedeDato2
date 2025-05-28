"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getUserOrders } from "@/lib/data"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function RecentOrders() {
  const [orders, setOrders] = useState(() => {
    // This would normally be fetched from the server
    return getUserOrders("all").slice(0, 5) // Get only the 5 most recent orders
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "preparing":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "delivering":
        return <Clock className="h-4 w-4 text-purple-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "delivering":
        return "bg-purple-100 text-purple-800"
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
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          You have {orders.filter((o) => o.status === "pending").length} pending orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Order #{order.id.slice(-6)}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString()} • {order.items.length} items • ${order.total.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(order.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </Badge>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
