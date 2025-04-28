import Image from "next/image"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, DollarSign } from "lucide-react"
import { RestaurantMenu } from "@/components/restaurant-menu"
import { RestaurantReviews } from "@/components/restaurant-reviews"
import { getRestaurantById } from "@/lib/data"

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const restaurant = await getRestaurantById(params.id)

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-6">
        <Image
          src={restaurant.image || "/placeholder.svg?height=320&width=1280"}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {restaurant.rating.toFixed(1)} ({restaurant.reviewCount} reviews)
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {restaurant.deliveryTime} min
            </Badge>
            <Badge variant="outline">{restaurant.cuisine}</Badge>
            {restaurant.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{restaurant.address}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button>Place Order</Button>
          <Button variant="outline">Save</Button>
        </div>
      </div>

      <Tabs defaultValue="menu">
        <TabsList className="mb-6">
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <RestaurantMenu restaurantId={restaurant.id} />
        </TabsContent>

        <TabsContent value="reviews">
          <RestaurantReviews restaurantId={restaurant.id} />
        </TabsContent>

        <TabsContent value="info">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="text-muted-foreground">{restaurant.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Hours</h3>
              <ul className="space-y-1 text-muted-foreground">
                {restaurant.hours.map((hour, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{hour.day}</span>
                    <span>
                      {hour.open} - {hour.close}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Price Range</h3>
              <div className="flex items-center">
                {Array(restaurant.priceLevel)
                  .fill(0)
                  .map((_, i) => (
                    <DollarSign key={i} className="h-4 w-4 text-green-600" />
                  ))}
                {Array(4 - restaurant.priceLevel)
                  .fill(0)
                  .map((_, i) => (
                    <DollarSign key={i} className="h-4 w-4 text-muted-foreground opacity-30" />
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
