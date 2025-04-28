"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ThumbsUp, Flag } from "lucide-react"
import { getReviewsByRestaurantId } from "@/lib/data"
import type { Review } from "@/lib/types"

interface RestaurantReviewsProps {
  restaurantId: string
}

export function RestaurantReviews({ restaurantId }: RestaurantReviewsProps) {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>(() => {
    // This would normally be fetched from the server
    return getReviewsByRestaurantId(restaurantId)
  })
  const [sortBy, setSortBy] = useState("recent")

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === "highest") {
      return b.rating - a.rating
    } else if (sortBy === "lowest") {
      return a.rating - b.rating
    }
    return 0
  })

  const handleAddReview = () => {
    // In a real app, this would navigate to a review form or open a modal
    router.push(`/restaurants/${restaurantId}/review`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddReview}>Write a Review</Button>
        </div>
      </div>

      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to review this restaurant</p>
            <Button onClick={handleAddReview}>Write a Review</Button>
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
            <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{review.user.name}</div>
            <div className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="flex items-center">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
              />
            ))}
        </div>
      </div>

      {review.orderId && (
        <div className="bg-muted rounded px-3 py-2 text-sm mt-3">
          <span className="font-medium">Verified Order</span> • Ordered on{" "}
          {new Date(review.orderDate).toLocaleDateString()}
        </div>
      )}

      <p className="mt-3">{review.comment}</p>

      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 mt-3">
          {review.photos.map((photo, index) => (
            <div key={index} className="relative h-20 w-20 rounded overflow-hidden">
              <img
                src={photo || "/placeholder.svg"}
                alt={`Review photo ${index + 1}`}
                className="object-cover h-full w-full"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <ThumbsUp className="h-4 w-4 mr-1" />
          Helpful ({review.helpfulCount || 0})
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Flag className="h-4 w-4 mr-1" />
          Report
        </Button>
      </div>
    </div>
  )
}
