"use client"

import { Card, CardContent } from "@/components/ui/card"

interface TopItemsProps {
  data: {
    name: string
    value: number
    orders: number
  }[]
}

export function TopItems({ data }: TopItemsProps) {
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Card key={item.name}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.orders} orders</p>
              </div>
              <div className="font-medium">${item.value.toFixed(2)}</div>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${(item.orders / Math.max(...data.map((d) => d.orders))) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
