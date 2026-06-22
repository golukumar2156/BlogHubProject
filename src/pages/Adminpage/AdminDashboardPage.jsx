import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Users,
  FolderOpen,
  BarChart3,
  TrendingUp,
  Activity,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import axiosInstance from "@/service/axiosInstance"
import { useSelector } from "react-redux"

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalPosts: null,
    totalUsers: null,
    totalCategories: null,
  })
  const [recentPosts, setRecentPosts] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const { user } = useSelector((state) => state.auth)
  const adminName = user?.fullName || "Administrator"

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [postsRes, usersRes, categoriesRes] = await Promise.all([
        axiosInstance.get("/posts/all"),
        axiosInstance.get("/authors"),
        axiosInstance.get("/categories"),
      ])

      const posts = postsRes.data || []
      const users = usersRes.data || []
      const categories = categoriesRes.data || []

      setStats({
        totalPosts: posts.length,
        totalUsers: users.length,
        totalCategories: categories.length,
      })

      // Recent 5 posts — createdAt se sort
      const sortedPosts = [...posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setRecentPosts(sortedPosts.slice(0, 5))

      // Recent 5 users — createdAt se sort
      const sortedUsers = [...users].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setRecentUsers(sortedUsers.slice(0, 5))
    } catch (err) {
      setError("Failed to load data. Please check the backend.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Time ago helper
  const timeAgo = (dateStr) => {
    if (!dateStr) return "Unknown"
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHrs = Math.floor(diffMins / 60)
    if (diffHrs < 24) return `${diffHrs} hr ago`
    const diffDays = Math.floor(diffHrs / 24)
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  }

  const statCards = [
    {
      label: "Total Blogs",
      value: stats.totalPosts,
      icon: BookOpen,
      color: "from-violet-500 to-indigo-600",
    },
    {
      label: "Total Authors",
      value: stats.totalUsers,
      icon: Users,
      color: "from-cyan-500 to-blue-600",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "from-emerald-500 to-teal-600",
    },
  ]

  return (
    <div className="flex-1 min-h-screen bg-background">
      {/* Top Header */}
      <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 md:px-8 sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
        <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">

        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border border-border/40 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Welcome, {adminName} 👋</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage your BlogHub platform and monitor activity
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-2 w-fit">
            <Activity className="w-4 h-4 text-primary" />
            <span>Live data from backend</span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl px-5 py-4 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="glass-card p-5 rounded-2xl flex flex-col gap-3 hover:shadow-lg smooth-transition group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 smooth-transition`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {loading ? (
                  <div className="h-9 w-16 bg-muted/50 rounded-lg animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold tracking-tight">
                    {stat.value ?? "—"}
                  </p>
                )}

                <div className="flex items-center gap-1 text-xs text-emerald-500 font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  <span>Live count</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Middle Row: Recent Posts + Recent Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent Posts */}
          <div className="glass-card rounded-2xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-500" />
                Recent Posts
              </h3>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted/40 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Koi post nahi mili</p>
            ) : (
              <div className="space-y-2">
                {recentPosts.map((post) => (
                  <div
                    key={post.ID}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted/30 smooth-transition"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground">
                        by {post.authorName} • {post.categoryName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-3 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="glass-card rounded-2xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-500" />
                Recent Authors
              </h3>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted/40 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Koi user nahi mila</p>
            ) : (
              <div className="space-y-2">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted/30 smooth-transition"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {user.fullName?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-3 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{timeAgo(user.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Summary Card */}
        <div className="glass-card rounded-2xl p-5 md:p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Platform Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Blogs Published", value: stats.totalPosts, color: "text-violet-500" },
              { label: "Registered Authors", value: stats.totalUsers, color: "text-cyan-500" },
              { label: "Blog Categories", value: stats.totalCategories, color: "text-emerald-500" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-muted/20 rounded-xl px-5 py-4 flex flex-col gap-1 border border-border/30"
              >
                <span className="text-xs text-muted-foreground">{item.label}</span>
                {loading ? (
                  <div className="h-7 w-12 bg-muted/50 rounded animate-pulse mt-1" />
                ) : (
                  <span className={`text-2xl font-bold ${item.color}`}>
                    {item.value ?? "—"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboardPage