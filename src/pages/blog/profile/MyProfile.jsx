import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  User, Mail, ShieldCheck, CheckCircle, XCircle,
  CalendarDays, BookOpen, FolderOpen, ArrowLeft,
  TrendingUp, Clock, FileText,
} from "lucide-react"
import { useEffect, useState } from "react"
import axiosInstance from "@/service/axiosInstance"
import Sidebar from "../Sidebar"

export default function MyProfile() {
  const { user }  = useSelector((s) => s.auth)
  const navigate  = useNavigate()

  const [myPosts,    setMyPosts]    = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          axiosInstance.get("/posts/all"),   // ✅ sahi endpoint
          axiosInstance.get("/categories"),
        ])
        const all  = Array.isArray(postsRes.data) ? postsRes.data : []
        // User ke apne posts filter karo authorName se (same as Dashboard)
        const mine = all.filter(
          (p) => p.authorName?.toLowerCase().trim() === user?.fullName?.toLowerCase().trim()
        )
        setMyPosts(mine)
        setCategories(Array.isArray(catsRes.data) ? catsRes.data : [])
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    load()
  }, [user])

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—"

  const recentPosts = [...myPosts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)

  const topCategory = (() => {
    if (!myPosts.length) return "—"
    const freq = {}
    myPosts.forEach((p) => { const n = p.categoryName || "Other"; freq[n] = (freq[n] || 0) + 1 })
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"
  })()

  const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-muted/50 rounded-lg ${className}`} />
  )

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <div className="flex-1 lg:ml-64 min-w-0 pt-14 lg:pt-0 flex flex-col">

        {/* Header */}
        <header className="h-16 border-b border-border/50 flex items-center gap-3
                           px-4 sm:px-6 lg:px-8 sticky top-0 z-40
                           bg-background/80 backdrop-blur-md flex-shrink-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <User className="w-5 h-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">My Profile</h1>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">

            {/* Profile Hero Card */}
            <section className="glass-card rounded-2xl overflow-hidden">
              {/* Banner */}
              <div className="h-24 sm:h-32 bg-gradient-to-br from-violet-500/30 via-primary/20 to-cyan-500/20" />

              <div className="px-5 sm:px-8 pb-6">
                {/* Avatar overlaps banner */}
                <div className="-mt-10 sm:-mt-12 mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br
                                  from-violet-500 to-indigo-600 flex items-center justify-center
                                  shadow-xl ring-4 ring-background flex-shrink-0">
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-2 px-4 py-2 border border-border
                               rounded-xl text-sm font-medium hover:bg-muted/40 transition-colors w-fit"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Name */}
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  {user?.fullName || "Author"}
                </h2>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                   text-xs font-semibold bg-primary/15 text-primary">
                    <ShieldCheck className="w-3 h-3" />
                    {user?.role || "AUTHOR"}
                  </span>
                  {user?.verified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                     text-xs font-semibold bg-emerald-500/15 text-emerald-500">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                     text-xs font-semibold bg-rose-500/15 text-rose-500">
                      <XCircle className="w-3 h-3" /> Not Verified
                    </span>
                  )}
                </div>

                {/* Info rows */}
                <div className="space-y-3 border-t border-border/30 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium break-all">{user?.email || "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="font-medium">{user?.role || "AUTHOR"}</p>
                    </div>
                  </div>

                  {user?.createdAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CalendarDays className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Member Since</p>
                        <p className="font-medium">{fmtDate(user.createdAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: "My Blogs",     value: myPosts.length,    icon: BookOpen,   color: "from-violet-500 to-indigo-600", span: false },
                { label: "Categories",   value: categories.length, icon: FolderOpen, color: "from-emerald-500 to-teal-600",  span: false },
                { label: "Top Category", value: topCategory,       icon: TrendingUp, color: "from-rose-500 to-pink-600",     span: true  },
              ].map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label}
                       className={`glass-card p-4 sm:p-5 rounded-2xl flex flex-col gap-2 group
                                   hover:shadow-lg smooth-transition
                                   ${s.span ? "col-span-2 sm:col-span-1" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">{s.label}</p>
                      <div className={`w-9 h-9 flex-shrink-0 bg-gradient-to-br ${s.color}
                                       rounded-xl flex items-center justify-center shadow-sm
                                       group-hover:scale-110 smooth-transition`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    {loading
                      ? <Skeleton className="h-8 w-14 mt-1" />
                      : <p className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{s.value ?? "—"}</p>
                    }
                  </div>
                )
              })}
            </section>

            {/* Recent Posts */}
            <section className="glass-card rounded-2xl p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  My Recent Posts
                </h3>
                <button onClick={() => navigate("/my-blogs")} className="text-xs text-primary hover:underline flex-shrink-0">
                  View all →
                </button>
              </div>

              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
              ) : recentPosts.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-3 text-center">
                  <FileText className="w-10 h-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Abhi koi blog nahi likha</p>
                  <button onClick={() => navigate("/create-blog")} className="text-sm text-primary hover:underline">
                    Pehla blog likhein →
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {recentPosts.map((post) => (
                    <div key={post.ID || post.id}
                         onClick={() => navigate(`/blog/${post.ID || post.id}`)}
                         className="flex items-center gap-3 py-3.5 px-2 rounded-xl
                                    hover:bg-muted/30 smooth-transition cursor-pointer group">
                      <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-violet-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {post.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{post.categoryName || "Uncategorized"}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Categories I Write In */}
            {!loading && (() => {
              const usedCats = [...new Set(myPosts.map(p => p.categoryName).filter(Boolean))]
              if (!usedCats.length) return null
              return (
                <section className="glass-card rounded-2xl p-4 sm:p-5 lg:p-6">
                  <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    Categories I Write In
                    <span className="ml-auto text-xs font-normal text-muted-foreground">{usedCats.length} categories</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {usedCats.map((cat) => (
                      <span key={cat} className="px-3 py-1.5 rounded-full text-xs font-medium
                                                  bg-emerald-500/10 text-emerald-600 border border-emerald-500/20
                                                  hover:bg-emerald-500/20 transition-colors">
                        {cat}
                      </span>
                    ))}
                  </div>
                </section>
              )
            })()}

          </div>
        </main>
      </div>
    </div>
  )
}