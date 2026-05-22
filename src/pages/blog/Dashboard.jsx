import { Button } from "@/components/ui/button"
import { BarChart3, Users, BookOpen, TrendingUp } from "lucide-react"
import Sidebar from "./Sidebar"   // ✅ FIX


const Dashboard = () => {
  const stats = [
    { label: "Total Blogs", value: "12", icon: BookOpen, color: "from-primary to-secondary" },
    { label: "Total Views", value: "3.2K", icon: TrendingUp, color: "from-accent to-primary" },
    { label: "Followers", value: "245", icon: Users, color: "from-secondary to-accent" },
    { label: "Avg. Rating", value: "4.8", icon: BarChart3, color: "from-accent to-secondary" },
  ]

  const recentBlogs = [
    { id: 1, title: "Getting Started with React", views: 234, status: "published", date: "Jan 8, 2025" },
    { id: 2, title: "CSS Tips & Tricks", views: 156, status: "published", date: "Jan 6, 2025" },
    { id: 3, title: "JavaScript Fundamentals", views: 0, status: "draft", date: "Jan 5, 2025" },
  ]

  return (
    <div className="flex bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="h-16 border-b flex items-center px-6 sticky top-0 bg-background">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here's an overview of your blog activity
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="glass-card p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </div>
              )
            })}
          </div>

          {/* Recent Blogs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="text-xl font-bold mb-4">Recent Blogs</h3>

              {recentBlogs.map((blog) => (
                <div key={blog.id} className="flex justify-between p-4 rounded-lg hover:bg-muted/30">
                  <div>
                    <p className="font-semibold">{blog.title}</p>
                    <p className="text-sm text-muted-foreground">{blog.date}</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span>{blog.views} views</span>
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      blog.status === "published"
                        ? "bg-primary/20 text-primary"
                        : "bg-muted"
                    }`}>
                      {blog.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <Button className="w-full mb-2">+ New Blog</Button>
              <Button variant="outline" className="w-full mb-2">View Analytics</Button>
              <Button variant="outline" className="w-full mb-2">Manage Categories</Button>
              <Button variant="outline" className="w-full">Profile Settings</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
