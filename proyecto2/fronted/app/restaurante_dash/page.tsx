import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { RecentReviews } from "@/components/dashboard/recent-reviews"
import { Overview } from "@/components/dashboard/overview"
import { TopItems } from "@/components/dashboard/top-items"
import AddMenuItem from "@/components/dashboard/add-menu-item"
import { getRestaurantStats } from "@/lib/data"
import { ArrowUpRight, Utensils, Clock, Star, DollarSign } from "lucide-react"

export default async function DashboardPage() {
  const stats = await getRestaurantStats("rest-1") // In a real app, this would be the logged-in restaurant's ID

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your restaurant's performance and recent activity." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+{stats.revenueIncrease}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersToday}</div>
            <p className="text-xs text-muted-foreground">
              {stats.ordersIncrease > 0 ? "+" : ""}
              {stats.ordersIncrease}% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDeliveryTime} min</div>
            <p className="text-xs text-muted-foreground">
              {stats.deliveryTimeChange < 0 ? "" : "+"}
              {stats.deliveryTimeChange} min from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.ratingChange > 0 ? "+" : ""}
              {stats.ratingChange.toFixed(1)} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="menu">Menu Performance</TabsTrigger>
          <TabsTrigger value="manage-menu">Manage Menu</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={stats.revenueData} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Your most popular items this month</CardDescription>
              </CardHeader>
              <CardContent>
                <TopItems data={stats.topItems} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <RecentOrders />
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          <RecentReviews />
        </TabsContent>
        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Item Performance</CardTitle>
              <CardDescription>See how your menu items are performing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {stats.menuPerformance.map((category) => (
                  <div key={category.name} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">{category.items.length} items</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {category.items.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between space-x-4 rounded-md border p-4"
                        >
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{item.name}</p>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center">
                              <span
                                className={`text-sm font-medium ${item.trend > 0 ? "text-green-600" : item.trend < 0 ? "text-red-600" : ""}`}
                              >
                                {item.trend > 0 ? "+" : ""}
                                {item.trend}%
                              </span>
                              {item.trend !== 0 && (
                                <ArrowUpRight
                                  className={`ml-1 h-4 w-4 ${item.trend > 0 ? "text-green-600" : "text-red-600 transform rotate-90"}`}
                                />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage-menu" className="space-y-4">
          <AddMenuItem />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}