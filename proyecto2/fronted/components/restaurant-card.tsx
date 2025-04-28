import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Restaurant } from "@/lib/types"

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={restaurant.image || "/placeholder.svg?height=192&width=384"}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-1">{restaurant.name}</h3>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{restaurant.cuisine}</p>
          <div className="flex gap-2 mt-2">
            {restaurant.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
          {restaurant.deliveryTime} min •{" "}
          {restaurant.deliveryFee ? `$${restaurant.deliveryFee.toFixed(2)} delivery` : "Free delivery"}
        </CardFooter>
      </Card>
    </Link>
  )
}
