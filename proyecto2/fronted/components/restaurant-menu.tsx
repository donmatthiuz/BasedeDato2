"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/use-cart"
import { getMenuByRestaurantId } from "@/lib/data"
import type { MenuItem, MenuCategory } from "@/lib/types"

interface RestaurantMenuProps {
  restaurantId: string
}

export function RestaurantMenu({ restaurantId }: RestaurantMenuProps) {
  const [menu, setMenu] = useState<{ categories: MenuCategory[] }>(() => {
    // This would normally be fetched from the server
    return getMenuByRestaurantId(restaurantId)
  })

  const { addItem } = useCart()

  return (
    <div>
      <Tabs defaultValue={menu.categories[0]?.id}>
        <TabsList className="mb-6 flex w-full overflow-x-auto">
          {menu.categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {menu.categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid gap-4">
              {category.items.map((item) => (
                <MenuItemCard key={item.id} item={item} onAddToCart={() => addItem(item)} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function MenuItemCard({ item, onAddToCart }: { item: MenuItem; onAddToCart: () => void }) {
  return (
    <Card>
      <CardContent className="p-4 flex gap-4">
        {item.image && (
          <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={item.image || "/placeholder.svg?height=96&width=96"}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
            </div>
            <div className="text-right">
              <div className="font-medium">${item.price.toFixed(2)}</div>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full mt-2" onClick={onAddToCart}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add to cart</span>
              </Button>
            </div>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
