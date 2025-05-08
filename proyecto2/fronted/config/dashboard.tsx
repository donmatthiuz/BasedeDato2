import { LayoutDashboard, ShoppingBag, FileText, Settings, Menu, BarChart3 } from "lucide-react"
import type { NavItem } from "@/types"

interface DashboardConfig {
  sidebarNav: NavItem[]
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
   
    {
      title: "Menu",
      href: "/dashboard/menu",
      icon: Menu,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Reviews",
      href: "/dashboard/reviews",
      icon: FileText,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ],
}
