import React from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, FolderOpen, MessageCircle, BarChart3 } from "lucide-react"
import { AdminSidebar } from "./adminsideBar/AdminSidebar"

const AdminDashboardPage = () => {
  // Dummy stats
  const stats = [
    { label: "Total Blogs", value: "342", icon: BookOpen, change: "+23" },
    { label: "Total Users", value: "1.2K", icon: Users, change: "+45" },
    { label: "Categories", value: "12", icon: FolderOpen, change: "+2" },
    { label: "Comments", value: "2.4K", icon: MessageCircle, change: "+156" },
  ]

  // Dummy recent activity
  const recentActivity = [
    { type: "blog", action: "New blog published", author: "Sarah Chen", time: "2 hours ago" },
    { type: "user", action: "New user registered", author: "John Doe", time: "4 hours ago" },
    { type: "blog", action: "Blog deleted", author: "Mike Johnson", time: "6 hours ago" },
    { type: "comment", action: "New comment received", author: "Emma Wilson", time: "8 hours ago" },
    { type: "user", action: "User updated profile", author: "Lisa Moore", time: "10 hours ago" },
  ]

  return (
    <div className="flex bg-background min-h-screen">
      <AdminSidebar/>

      <div className="flex-1">
        {/* Header */}
        <div className="h-16 border-b border-border/50 flex items-center px-6 md:px-8 sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome, Administrator</h2>
            <p className="text-muted-foreground">Manage your BlogHub platform and monitor activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-primary font-semibold">{stat.change} this month</p>
                </div>
              )
            })}
          </div>

          {/* Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Chart */}
            <div className="lg:col-span-2 glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Platform Activity</h3>
                <select className="px-3 py-1.5 bg-muted/50 border border-border/50 rounded text-sm outline-none">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>

              {/* Chart Placeholder */}
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Activity chart will display here</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-6 h-fit">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-bold">523</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pending Reviews</span>
                  <span className="font-bold text-primary">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">System Health</span>
                  <span className="font-bold text-primary">99.8%</span>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">View Detailed Reports</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                View All →
              </Button>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/30 smooth-transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "blog"
                          ? "bg-primary"
                          : activity.type === "user"
                          ? "bg-accent"
                          : "bg-secondary"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">by {activity.author}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminDashboardPage