export interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  cuisine: string
  tags: string[]
  rating: number
  reviewCount: number
  priceLevel: number
  deliveryTime: number
  deliveryFee: number
  address: string
  hours: { day: string; open: string; close: string }[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  tags?: string[]
  category: string
}

export interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

export interface Review {
  id: string
  restaurantId: string
  orderId?: string
  orderDate?: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  date: string
  photos?: string[]
  helpfulCount?: number
}

export interface Order {
  id: string
  userId: string
  restaurant: {
    id: string
    name: string
    image?: string
  }
  items: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
  status: "pending" | "preparing" | "delivering" | "completed" | "cancelled"
  date: string
  deliveryTime: string
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  reviewed: boolean
}
