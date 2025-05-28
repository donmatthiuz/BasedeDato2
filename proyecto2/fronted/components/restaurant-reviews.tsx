"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ThumbsUp, Flag } from "lucide-react"
import { getReviewsByRestaurantId } from "@/lib/data"
import type { Review } from "@/lib/types"
import useApi from "@/hooks/useApi"
import source_link from "@/repositori/source_repo"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import useID from "@/hooks/useID"


interface RestaurantReviewsProps {
  restaurantId: string
}

interface Resena {
  _id: string;
  menu: {
    nombre: string;
    precio: number;
    descripcion: string;
  };
  nombre_usuario: string;
  calificacion: number;
  comentario: string;
  fecha: string; // o `Date` si la conviertes
  usuario_id: string;
  restaurante_id: string;
}


interface MenuItem {
  _id: string
  nombre: string
  precio: number
  descripcion: string
  disponible: boolean
  restaurante_id: string
  imagen_id: string
}



export function RestaurantReviews({ restaurantId }: RestaurantReviewsProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("")
  const { userID, setUserID } = useID();



  const [revw, setRevw] = useState<Resena[]>([])
  const [menu, setMenu] = useState<MenuItem[]>([])

  const {llamado_whit_link: review_get} = useApi(``)
  const {llamado: resena_post} = useApi(`${source_link}/api/resena`)


  useEffect(() => {
    
    const getReviews = async() => {
      
        const response = await review_get(`${source_link}/api/resena?restaurante_id=${restaurantId}&limit=100`,"GET")
        setRevw(response)
        const menus = await review_get(`${source_link}/api/menu?restaurante_id=${restaurantId}&disponible=true`,"GET")
        setMenu(menus)

     }

     getReviews();

  }, [])


  const onResena = async() =>{
    console.log("Reseña enviada:", {
      platillo: selectedMenuItem,
      calificacion: newRating,
      comentario: newComment
    })


    const mi_menu = await review_get(`${source_link}/api/menu?restaurante_id=${restaurantId}&disponible=true`,"GET")

    const nombre = await review_get(`${source_link}/api/usuario?_id=${userID}`,"GET")

    const response = await resena_post({
      restaurante_id: restaurantId,
      usuario_id: userID,
      nombre_usuario: nombre[0].nombre,
      calificacion: newRating,
      comentario: newComment,
      fecha: new Date().toISOString(),
      menu: {
        nombre: mi_menu[0].nombre,
        precio: mi_menu[0].precio,
        descripcion: mi_menu[0].descripcion
      }
    }, "POST")

    console.log(response)
    setIsModalOpen(false)
    setSelectedMenuItem("")
    setNewRating(0)
    setNewComment("")


  }

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

  

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Write a Review</DialogTitle>
    </DialogHeader>

    <div className="flex items-center gap-2">
      {Array(5).fill(0).map((_, i) => (
        <Star
          key={i}
          className={`h-6 w-6 cursor-pointer ${i < (hoverRating || newRating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
          onMouseEnter={() => setHoverRating(i + 1)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setNewRating(i + 1)}
        />
      ))}
    </div>

    <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
  <SelectTrigger className="w-full mt-2">
    <SelectValue placeholder="Selecciona un platillo" />
  </SelectTrigger>
  <SelectContent>
    {menu.map((item) => (
      <SelectItem key={item._id} value={item._id}>
        {item.nombre}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

    <Textarea
      placeholder="Write your review here..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      className="mt-4"
    />

    <DialogFooter className="mt-4">
      <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
      <Button
        onClick={onResena}
      >
        Submit
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        <div className="flex items-center gap-4">
          {/* <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select> */}
          <Button onClick={() => setIsModalOpen(true)}>Write a Review</Button>
        </div>
      </div>

      <div className="space-y-6">
        {revw.map((review) => (
          <ReviewCard  review={review} />
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to review this restaurant</p>
            <Button onClick={() => setIsModalOpen(true)}>Write a Review</Button>
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: Resena }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={"/placeholder.svg"} alt={review.nombre_usuario} />
            <AvatarFallback>{review.nombre_usuario.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{review.nombre_usuario}</div>
            <div className="text-sm text-muted-foreground">{new Date(review.fecha).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="flex items-center">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.calificacion ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
              />
            ))}
        </div>
      </div>

      {/* {review.orderId && (
        <div className="bg-muted rounded px-3 py-2 text-sm mt-3">
          <span className="font-medium">Verified Order</span> • Ordered on{" "}
          {new Date(review.orderDate).toLocaleDateString()}
        </div>
      )} */}

      <p className="mt-3">{review.comentario}</p>

      {/* {review.photos && review.photos.length > 0 && (
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
      )} */}

      {/* <div className="flex gap-4 mt-4">
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <ThumbsUp className="h-4 w-4 mr-1" />
          Helpful ({review.helpfulCount || 0})
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Flag className="h-4 w-4 mr-1" />
          Report
        </Button>
      </div> */}
    </div>
  )
}
