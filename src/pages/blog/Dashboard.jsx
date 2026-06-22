import { useEffect, useState, useMemo } from "react"
import { useSelector } from "react-redux"
import {
  BookOpen, FolderOpen, TrendingUp, RefreshCw,
  AlertCircle, Activity, BarChart3, FileText,
  ShieldCheck, CheckCircle, Loader2, WifiOff,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts"
import axiosInstance from "@/service/axiosInstance"
import Sidebar from "./Sidebar"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// ── Chart config ──────────────────────────────────────────────
const chartConfig = {
  myBlogs: {
    label: "My Blogs",
    color: "var(--chart-1, #8b5cf6)",
  },
  totalBlogs: {
    label: "Total Blogs",
    color: "var(--chart-2, #06b6d4)",
  },
}

export default function Dashboard() {
  const { user, token } = useSelector((s) => s.auth)

  const [myPosts,    setMyPosts]    = useState([])
  const [allPosts,   setAllPosts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  // which bar series is active — "myBlogs" or "totalBlogs"
  const [activeChart, setActiveChart] = useState("myBlogs")

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const tok = token || localStorage.getItem("token")
    if (!tok) { setError("Authentication token not found. Please logout and login again."); setLoading(false); return }

    try {
      const [allRes, catRes] = await Promise.all([
        axiosInstance.get("/posts/all"),
        axiosInstance.get("/categories"),
      ])
      const all  = Array.isArray(allRes.data) ? allRes.data : []
      const cats = Array.isArray(catRes.data) ? catRes.data : []
      const mine = all.filter(
        (p) => p.authorName?.toLowerCase().trim() === user?.fullName?.toLowerCase().trim()
      )
      setAllPosts(all)
      setMyPosts(mine)
      setCategories(cats)
    } catch (err) {
      const status = err?.response?.status
      if (!err?.response)                        setError("no_server")
      else if (status === 401 || status === 403) setError("unauthorized")
      else                                       setError(`server_${status}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // ── top category ──
  const topCategory = useMemo(() => {
    if (!myPosts.length) return "—"
    const freq = {}
    myPosts.forEach((p) => { const n = p.categoryName || "Other"; freq[n] = (freq[n] || 0) + 1 })
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"
  }, [myPosts])

  // ── Bar chart data: category vs (myBlogs count + total count) ──
  const chartData = useMemo(() => {
    if (!categories.length) return []
    return categories.map((cat) => {
      const total = allPosts.filter(p => p.categoryName === cat.catName).length
      const mine  = myPosts.filter(p => p.categoryName === cat.catName).length
      return { category: cat.catName, myBlogs: mine, totalBlogs: total }
    }).filter(d => d.totalBlogs > 0)
  }, [categories, allPosts, myPosts])

  // ── totals for the toggle buttons ──
  const totals = useMemo(() => ({
    myBlogs:    myPosts.length,
    totalBlogs: allPosts.length,
  }), [myPosts, allPosts])

  const stats = [
    { label: "My Blogs",       value: myPosts.length,    icon: BookOpen,   gradient: "from-violet-500 to-indigo-600" },
    { label: "Platform Blogs", value: allPosts.length,   icon: FileText,   gradient: "from-cyan-500 to-blue-600"    },
    { label: "Categories",     value: categories.length, icon: FolderOpen, gradient: "from-emerald-500 to-teal-600" },
    { label: "Top Category",   value: topCategory,       icon: TrendingUp, gradient: "from-rose-500 to-pink-600"   },
  ]

  const Skel = ({ className }) => (
    <div className={`animate-pulse bg-muted/50 rounded-lg ${className}`} />
  )

  const getErrorMsg = () => {
    if (error === "no_server")    return "Backend server is not running (localhost:7000). Please start the server and refresh the page."
    if (error === "unauthorized") return "Session has expired. Please logout and login again."
    return `Server error. (${error})`
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <div className="flex-1 lg:ml-64 min-w-0 pt-14 lg:pt-0 flex flex-col">

        {/* HEADER */}
        <header className="h-16 border-b border-border/50 flex items-center justify-between
                           px-4 sm:px-6 lg:px-8 sticky top-0 z-40
                           bg-background/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">My Dashboard</h1>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-muted-foreground
                       hover:text-foreground transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full">

            {/* WELCOME BANNER */}
            <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10
                                border border-border/40 p-5 sm:p-6 lg:p-8
                                flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1.5 truncate">
                  Welcome, {user?.fullName || "Author"} 👋
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[220px]">{user?.email}</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                                   text-xs font-semibold bg-primary/15 text-primary">
                    <ShieldCheck className="w-3 h-3" />{user?.role || "AUTHOR"}
                  </span>
                  {user?.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                                     text-xs font-semibold bg-emerald-500/15 text-emerald-500">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground
                              bg-muted/50 border border-border/40 rounded-xl px-4 py-2.5 w-fit flex-shrink-0">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <span>Live data from backend</span>
              </div>
            </section>

            {/* ERROR */}
            {error && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30
                              text-red-500 rounded-xl px-4 py-4 text-sm">
                {error === "no_server"
                  ? <WifiOff className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                <div>
                  <p className="font-medium mb-1">{getErrorMsg()}</p>
                  <button onClick={fetchData} className="text-xs underline underline-offset-2">Try Again →</button>
                </div>
              </div>
            )}

            {/* STAT CARDS */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label}
                       className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col gap-2
                                  hover:shadow-lg smooth-transition group cursor-default">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">{s.label}</p>
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 bg-gradient-to-br
                                       ${s.gradient} rounded-xl flex items-center justify-center
                                       shadow-sm group-hover:scale-110 smooth-transition`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </div>
                    {loading
                      ? <Skel className="h-8 w-14 mt-1" />
                      : <p className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{s.value ?? "—"}</p>
                    }
                  </div>
                )
              })}
            </section>

            {/* ── ACTIVITY SUMMARY — INTERACTIVE BAR CHART ── */}
            <section className="glass-card rounded-2xl overflow-hidden">

              {/* Card Header */}
              <div className="border-b border-border/40 px-5 pt-4 pb-3 sm:px-6 sm:py-5">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Activity Summary
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Category-wise blog distribution — My Blogs vs Total Blogs
                </p>
              </div>

              {/* ── Two stat divs side by side ── */}
              <div className="grid grid-cols-2 gap-0 border-b border-border/40">
                {/* LEFT — My Blogs */}
                <button
                  data-active={activeChart === "myBlogs"}
                  onClick={() => setActiveChart("myBlogs")}
                  className="relative flex flex-col gap-1 px-5 py-4 text-left
                             transition-colors hover:bg-muted/30
                             data-[active=true]:bg-violet-500/10
                             border-r border-border/40 sm:px-8 sm:py-6"
                >
                  <span className="text-xs text-muted-foreground font-medium">My Blogs</span>
                  {loading
                    ? <Skel className="h-8 w-12 mt-0.5" />
                    : <span className="text-2xl sm:text-3xl font-bold tracking-tight text-violet-500 leading-none">
                        {totals.myBlogs.toLocaleString()}
                      </span>
                  }
                  <span className="text-[11px] text-muted-foreground mt-0.5">Blogs written by you</span>
                  {activeChart === "myBlogs" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-violet-500" />
                  )}
                </button>

                {/* RIGHT — Total Blogs */}
                <button
                  data-active={activeChart === "totalBlogs"}
                  onClick={() => setActiveChart("totalBlogs")}
                  className="relative flex flex-col gap-1 px-5 py-4 text-left
                             transition-colors hover:bg-muted/30
                             data-[active=true]:bg-cyan-500/10
                             sm:px-8 sm:py-6"
                >
                  <span className="text-xs text-muted-foreground font-medium">Total Blogs</span>
                  {loading
                    ? <Skel className="h-8 w-12 mt-0.5" />
                    : <span className="text-2xl sm:text-3xl font-bold tracking-tight text-cyan-500 leading-none">
                        {totals.totalBlogs.toLocaleString()}
                      </span>
                  }
                  <span className="text-[11px] text-muted-foreground mt-0.5">All blogs on platform</span>
                  {activeChart === "totalBlogs" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-cyan-500" />
                  )}
                </button>
              </div>

              {/* Chart body — transparent bg fix */}
              <div className="p-4 sm:p-5 lg:p-6 bg-transparent">
                {loading ? (
                  <Skel className="h-[250px] w-full rounded-xl" />
                ) : chartData.length === 0 ? (
                  <div className="h-[250px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <BarChart3 className="w-10 h-10 opacity-20" />
                    <p className="text-sm">Koi data nahi mila — blogs create karo!</p>
                  </div>
                ) : (
                  <ChartContainer
                    config={chartConfig}
                    className="h-[250px] w-full [&_.recharts-wrapper]:!bg-transparent [&_svg]:!bg-transparent"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ left: 0, right: 0, top: 4, bottom: 0 }}
                        style={{ background: "transparent" }}
                      >
                        <CartesianGrid vertical={false} stroke="hsl(var(--border)/0.4)" />
                        <XAxis
                          dataKey="category"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                          interval={0}
                          minTickGap={20}
                        />
                        <ChartTooltip
                          cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                          content={
                            <ChartTooltipContent
                              className="w-[160px] !bg-background !border-border"
                              nameKey={activeChart}
                              labelFormatter={(val) => val}
                            />
                          }
                        />
                        <Bar
                          dataKey={activeChart}
                          fill={chartConfig[activeChart].color}
                          radius={[6, 6, 0, 0]}
                          maxBarSize={48}
                          name={chartConfig[activeChart].label}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </div>
            </section>

            {/* AVAILABLE CATEGORIES */}
            <section className="glass-card rounded-2xl p-4 sm:p-5 lg:p-6">
              <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                Available Categories
                {!loading && (
                  <span className="ml-auto text-xs font-normal text-muted-foreground">{categories.length} total</span>
                )}
              </h3>
              {loading ? (
                <div className="flex flex-wrap gap-2">
                  {[1,2,3,4,5,6].map(i => <Skel key={i} className="h-8 w-20 rounded-full" />)}
                </div>
              ) : categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">Koi category nahi mili</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span key={cat.ID}
                          className="px-3 py-1.5 rounded-full text-xs font-medium
                                     bg-primary/10 text-primary border border-primary/20
                                     hover:bg-primary/20 transition-colors cursor-default">
                      {cat.catName}
                    </span>
                  ))}
                </div>
              )}
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}