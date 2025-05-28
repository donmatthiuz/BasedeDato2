// This file simulates a database with mock data
// In a real application, this would be replaced with actual database queries

import useApi from "@/hooks/useApi"
import type { Restaurant, Review, Order } from "./types"
import source_link from "@/repositori/source_repo"
interface MenuItem {
  _id: string
  nombre: string
  precio: number
  descripcion: string
  disponible: boolean
  restaurante_id: string
  imagen_id: string
}

// Mock data for restaurants
const restaurants: Restaurant[] = [
  {
    id: "rest-1",
    name: "Bella Italia",
    description: "Authentic Italian cuisine with fresh ingredients imported directly from Italy.",
    image: "/placeholder.svg?height=320&width=640",
    cuisine: "Italian",
    tags: ["Pizza", "Pasta", "Wine"],
    rating: 4.7,
    reviewCount: 243,
    priceLevel: 2,
    deliveryTime: 30,
    deliveryFee: 2.99,
    address: "123 Main St, Anytown, USA",
    hours: [
      { day: "Monday", open: "11:00 AM", close: "10:00 PM" },
      { day: "Tuesday", open: "11:00 AM", close: "10:00 PM" },
      { day: "Wednesday", open: "11:00 AM", close: "10:00 PM" },
      { day: "Thursday", open: "11:00 AM", close: "10:00 PM" },
      { day: "Friday", open: "11:00 AM", close: "11:00 PM" },
      { day: "Saturday", open: "11:00 AM", close: "11:00 PM" },
      { day: "Sunday", open: "12:00 PM", close: "9:00 PM" },
    ],
  },
  {
    id: "rest-2",
    name: "Sushi Palace",
    description: "Premium sushi and Japanese cuisine prepared by master chefs.",
    image: "/placeholder.svg?height=320&width=640",
    cuisine: "Japanese",
    tags: ["Sushi", "Ramen", "Sake"],
    rating: 4.5,
    reviewCount: 187,
    priceLevel: 3,
    deliveryTime: 40,
    deliveryFee: 3.99,
    address: "456 Oak Ave, Anytown, USA",
    hours: [
      { day: "Monday", open: "12:00 PM", close: "9:00 PM" },
      { day: "Tuesday", open: "12:00 PM", close: "9:00 PM" },
      { day: "Wednesday", open: "12:00 PM", close: "9:00 PM" },
      { day: "Thursday", open: "12:00 PM", close: "9:00 PM" },
      { day: "Friday", open: "12:00 PM", close: "10:00 PM" },
      { day: "Saturday", open: "12:00 PM", close: "10:00 PM" },
      { day: "Sunday", open: "1:00 PM", close: "8:00 PM" },
    ],
  },
  {
    id: "rest-3",
    name: "Taco Fiesta",
    description: "Authentic Mexican street food with a modern twist.",
    image: "/placeholder.svg?height=320&width=640",
    cuisine: "Mexican",
    tags: ["Tacos", "Burritos", "Margaritas"],
    rating: 4.3,
    reviewCount: 156,
    priceLevel: 1,
    deliveryTime: 25,
    deliveryFee: 1.99,
    address: "789 Pine St, Anytown, USA",
    hours: [
      { day: "Monday", open: "11:00 AM", close: "9:00 PM" },
      { day: "Tuesday", open: "11:00 AM", close: "9:00 PM" },
      { day: "Wednesday", open: "11:00 AM", close: "9:00 PM" },
      { day: "Thursday", open: "11:00 AM", close: "9:00 PM" },
      { day: "Friday", open: "11:00 AM", close: "10:00 PM" },
      { day: "Saturday", open: "11:00 AM", close: "10:00 PM" },
      { day: "Sunday", open: "12:00 PM", close: "8:00 PM" },
    ],
  },
]

// Mock data for reviews
const reviews: Review[] = [
  {
    id: "rev-1",
    restaurantId: "rest-1",
    orderId: "order-1",
    orderDate: "2023-06-15",
    user: {
      id: "user-1",
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    comment: "The pasta was amazing! Definitely coming back for more.",
    date: "2023-06-16",
    helpfulCount: 12,
  },
  {
    id: "rev-2",
    restaurantId: "rest-1",
    user: {
      id: "user-2",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 4,
    comment: "Great food but delivery was a bit slow.",
    date: "2023-06-10",
    helpfulCount: 5,
  },
  {
    id: "rev-3",
    restaurantId: "rest-2",
    orderId: "order-2",
    orderDate: "2023-06-12",
    user: {
      id: "user-3",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    comment: "Best sushi in town! The dragon roll is a must-try.",
    date: "2023-06-13",
    photos: ["/placeholder.svg?height=200&width=200"],
    helpfulCount: 8,
  },
]


interface Restaurante {
  _id: string;
  nombre: string;
  categoria: string;
  direccion: string;
  coordenadas: {
    type: "Point";
    coordinates: [number, number]; // [longitud, latitud]
  };
  telefono: string;
}



// Mock data for orders
const orders: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    restaurant: {
      id: "rest-1",
      name: "Bella Italia",
      image: "/placeholder.svg?height=48&width=48",
    },
    items: [
      {
        id: "item-1",
        name: "Margherita Pizza",
        price: 12.99,
        quantity: 1,
      },
      {
        id: "item-2",
        name: "Spaghetti Carbonara",
        price: 14.99,
        quantity: 1,
      },
      {
        id: "item-3",
        name: "Tiramisu",
        price: 6.99,
        quantity: 1,
      },
    ],
    status: "completed",
    date: "2023-06-15",
    deliveryTime: "7:30 PM",
    subtotal: 34.97,
    deliveryFee: 2.99,
    discount: 5.0,
    total: 32.96,
    reviewed: true,
  },
  {
    id: "order-2",
    userId: "user-1",
    restaurant: {
      id: "rest-2",
      name: "Sushi Palace",
      image: "/placeholder.svg?height=48&width=48",
    },
    items: [
      {
        id: "item-4",
        name: "Dragon Roll",
        price: 16.99,
        quantity: 1,
      },
      {
        id: "item-5",
        name: "Miso Soup",
        price: 3.99,
        quantity: 2,
      },
    ],
    status: "delivering",
    date: "2023-06-20",
    deliveryTime: "6:45 PM",
    subtotal: 24.97,
    deliveryFee: 3.99,
    discount: 0,
    total: 28.96,
    reviewed: false,
  },
]

// Mock data access functions
export async function getTopRestaurants() {
  try {
    const res = await fetch(`${source_link}/api/restaurante?limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Puedes añadir token si es necesario:
        // Authorization: `Bearer ${token}`
      },
    })

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    return data as Restaurante[]
  } catch (error) {
    console.error("Error al obtener los menús:", error)
    return []
  }
}



export interface ResumenResena {
  total_resenas: number;
  restaurante_id: string;
  nombre_restaurante: string;
  promedio_calificacion: number;
}


export async function getRated() {
  try {
    const res = await fetch(`${source_link}/api/resena/promedios?ordenar=asc&ordenar_por=promedio_calificacion`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Puedes añadir token si es necesario:
        // Authorization: `Bearer ${token}`
      },
    })

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    return data as ResumenResena[]
  } catch (error) {
    console.error("Error al obtener los menús:", error)
    return []
  }
}


export async function getMenus(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${source_link}/api/menu?limit=15`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Puedes añadir token si es necesario:
        // Authorization: `Bearer ${token}`
      },
    })

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    return data as MenuItem[]
  } catch (error) {
    console.error("Error al obtener los menús:", error)
    return []
  }
}


export async function getMenus_Resturant(id: string): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${source_link}/api/menu?restaurante_id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Puedes añadir token si es necesario:
        // Authorization: `Bearer ${token}`
      },
    })

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    return data as MenuItem[]
  } catch (error) {
    console.error("Error al obtener los menús:", error)
    return []
  }
}

export async function getAllRestaurants(filters?: any) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return restaurants
}

export async function getRestaurantById(id: string) {
  // Simulate API delay
  try {
    const res = await fetch(`${source_link}/api/restaurante?_id${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Puedes añadir token si es necesario:
        // Authorization: `Bearer ${token}`
      },
    })

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    return data[0] as Restaurante
  } catch (error) {
    console.error("Error al obtener los menús:", error)
    return []
  }
}

export function getMenuByRestaurantId(id: string) {
  // This would normally be fetched from the server
  // Here we're returning mock data
  if (id === "rest-1") {
    return {
      categories: [
        {
          id: "cat-1",
          name: "Appetizers",
          items: [
            {
              id: "item-1",
              name: "Bruschetta",
              description: "Toasted bread topped with tomatoes, garlic, and basil",
              price: 8.99,
              category: "cat-1",
              tags: ["Vegetarian"],
            },
            {
              id: "item-2",
              name: "Calamari",
              description: "Fried squid served with marinara sauce",
              price: 10.99,
              category: "cat-1",
            },
          ],
        },
        {
          id: "cat-2",
          name: "Pasta",
          items: [
            {
              id: "item-3",
              name: "Spaghetti Carbonara",
              description: "Spaghetti with eggs, cheese, pancetta, and black pepper",
              price: 14.99,
              category: "cat-2",
              image: "/placeholder.svg?height=96&width=96",
            },
            {
              id: "item-4",
              name: "Fettuccine Alfredo",
              description: "Fettuccine tossed with butter and parmesan cheese",
              price: 13.99,
              category: "cat-2",
              tags: ["Vegetarian"],
              image: "/placeholder.svg?height=96&width=96",
            },
          ],
        },
        {
          id: "cat-3",
          name: "Pizza",
          items: [
            {
              id: "item-5",
              name: "Margherita",
              description: "Tomato sauce, mozzarella, and basil",
              price: 12.99,
              category: "cat-3",
              tags: ["Vegetarian"],
              image: "/placeholder.svg?height=96&width=96",
            },
            {
              id: "item-6",
              name: "Pepperoni",
              description: "Tomato sauce, mozzarella, and pepperoni",
              price: 14.99,
              category: "cat-3",
              image: "/placeholder.svg?height=96&width=96",
            },
          ],
        },
      ],
    }
  }

  // Default menu for other restaurants
  return {
    categories: [
      {
        id: "cat-1",
        name: "Popular Items",
        items: [
          {
            id: "item-1",
            name: "Signature Dish",
            description: "Our most popular item",
            price: 12.99,
            category: "cat-1",
            image: "/placeholder.svg?height=96&width=96",
          },
        ],
      },
    ],
  }
}

export function getReviewsByRestaurantId(id: string) {
  return reviews.filter((r) => r.restaurantId === id)
}

export async function getUserOrders(status = "all") {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (status === "all") {
    return orders
  }

  return orders.filter((o) => {
    if (status === "active") {
      return ["pending", "preparing", "delivering"].includes(o.status)
    }
    return o.status === status
  })
}

export async function getOrderById(id: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return orders.find((o) => o.id === id)
}



export async function getRestaurantStats(restaurantId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock data for restaurant stats
  return {
    totalRevenue: 12458.75,
    revenueIncrease: 12.5,
    ordersToday: 24,
    ordersIncrease: 8,
    avgDeliveryTime: 28,
    deliveryTimeChange: -3,
    rating: 4.7,
    ratingChange: 0.2,
    revenueData: [
      { name: "Jan", total: 1800 },
      { name: "Feb", total: 2100 },
      { name: "Mar", total: 1800 },
      { name: "Apr", total: 2400 },
      { name: "May", total: 2700 },
      { name: "Jun", total: 3200 },
      { name: "Jul", total: 3800 },
    ],
    topItems: [
      { name: "Margherita Pizza", value: 2450, orders: 189 },
      { name: "Spaghetti Carbonara", value: 1890, orders: 126 },
      { name: "Tiramisu", value: 1200, orders: 172 },
      { name: "Bruschetta", value: 950, orders: 106 },
    ],
    menuPerformance: [
      {
        name: "Pizza",
        items: [
          { name: "Margherita", price: 12.99, orders: 189, trend: 12 },
          { name: "Pepperoni", price: 14.99, orders: 145, trend: 5 },
          { name: "Vegetarian", price: 13.99, orders: 87, trend: -3 },
        ],
      },
      {
        name: "Pasta",
        items: [
          { name: "Spaghetti Carbonara", price: 14.99, orders: 126, trend: 8 },
          { name: "Fettuccine Alfredo", price: 13.99, orders: 98, trend: 0 },
          { name: "Lasagna", price: 15.99, orders: 112, trend: 15 },
        ],
      },
      {
        name: "Desserts",
        items: [
          { name: "Tiramisu", price: 6.99, orders: 172, trend: 20 },
          { name: "Cannoli", price: 5.99, orders: 84, trend: -2 },
          { name: "Panna Cotta", price: 6.49, orders: 63, trend: 4 },
        ],
      },
    ],
  }
}