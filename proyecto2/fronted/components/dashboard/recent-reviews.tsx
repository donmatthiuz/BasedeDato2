"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getReviewsByRestaurantId } from "@/lib/data"
import { Star } from "lucide-react"

export function RecentReviews() {
  const [reviews, setReviews] = useState(() => {
    // This would normally be fetched from the server
    return getReviewsByRestaurantId("rest-1").slice(0, 5) // Get only the 5 most recent reviews
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
        <CardDescription>Your restaurant has received {reviews.length} reviews recently.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
              <Avatar>
                <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{review.user.name}</p>
                  <div className="flex items-center">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
                        />
                      ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                <p className="text-sm line-clamp-2">{review.comment}</p>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  Reply
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
