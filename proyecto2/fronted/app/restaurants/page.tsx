import { Suspense } from "react"
import { RestaurantCard } from "@/components/restaurant-card"
import { RestaurantFilters } from "@/components/restaurant-filters"
import { getAllRestaurants } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export default function RestaurantsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <RestaurantFilters />
        </div>

        <div className="lg:col-span-3">
          <Suspense fallback={<RestaurantsLoadingSkeleton />}>
            <RestaurantsList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function RestaurantsList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const restaurants = await getAllRestaurants(searchParams)

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">No restaurants found</h2>
        <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  )
}

function RestaurantsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden border">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
