import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search, SlidersHorizontal, BookOpen, Clock, User,
  ChevronLeft, ChevronRight, X, TrendingUp, Loader2,
  AlertCircle, RefreshCw, FolderOpen, ArrowRight, FileText
} from "lucide-react"
import { Navbar } from "../Onbordingpage/Navbar"
import { publicAxios } from "@/service/axiosInstance"

// ── Gradient palette per category ──
const CATEGORY_COLORS = [
  "from-violet-500 to-indigo-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-fuchsia-500 to-purple-500",
]
const getCategoryColor = (name = "") => {
  let hash = 0
  for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash)
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length]
}

// ── Format date ──
const formatDate = (iso) => {
  if (!iso) return ""
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  } catch { return "" }
}

// ── Estimate read time from content ──
const readTime = (content = "") => {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

// ── Single Blog Card ──
function BlogCard({ post }) {
  const navigate = useNavigate()
  const color = getCategoryColor(post.categoryName)

  return (
    <div
      onClick={() => navigate(`/blog/${post.ID}`)}
      className="group glass-card rounded-2xl overflow-hidden cursor-pointer
                 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1
                 transition-all duration-300 border border-border/50 hover:border-border flex flex-col"
    >
      {/* Image / Placeholder */}
      <div className={`relative h-44 bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
        {post.imageUrl ? (
          <img
            src={post.imageUrl.startsWith("/uploads") ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:7000"}${post.imageUrl}` : post.imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-40">
            <FileText className="w-10 h-10 text-white" />
            <span className="text-white text-xs font-medium">No image yet</span>
          </div>
        )}
        {/* category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/40 text-white backdrop-blur-sm border border-white/10">
            {post.categoryName || "Uncategorized"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1 leading-relaxed">
          {post.content?.replace(/<[^>]+>/g, "") || "No preview available."}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-bold text-[10px]">
                {post.authorName?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
            <span className="truncate max-w-[90px] font-medium">{post.authorName || "Author"}</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime(post.content || "")} min
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 opacity-0" />
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Skeleton Card ──
function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/40 animate-pulse">
      <div className="h-44 bg-muted/60" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted/60 rounded-lg w-3/4" />
        <div className="h-4 bg-muted/60 rounded-lg w-full" />
        <div className="h-4 bg-muted/60 rounded-lg w-5/6" />
        <div className="h-3 bg-muted/40 rounded-lg w-1/2 mt-4" />
      </div>
    </div>
  )
}

// ── Pagination — Chrome browser style ──
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  // Build page numbers array with ellipsis — exactly like Chrome's PDF viewer
  const buildPages = () => {
    const items = []
    const SIBLINGS = 2   // how many pages either side of current

    const left  = Math.max(1, page - SIBLINGS)          // 1-based
    const right = Math.min(totalPages, page + SIBLINGS + 1) // 1-based, exclusive

    // Always show page 1
    items.push(1)

    // Left ellipsis
    if (left > 2) items.push("…l")

    // Window around current page
    for (let i = left; i < right; i++) {
      if (i !== 1 && i !== totalPages) items.push(i)
    }

    // Right ellipsis
    if (right < totalPages) items.push("…r")

    // Always show last page
    if (totalPages > 1) items.push(totalPages)

    return items
  }

  const pages = buildPages()
  const currentPage = page + 1   // convert 0-based → 1-based for display

  const btnBase =
    "min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium flex items-center justify-center transition-all duration-150 select-none"

  return (
    <div className="flex flex-col items-center gap-3">

      {/* ── Pagination bar ── */}
      <nav aria-label="Pagination" className="flex items-center gap-1">

        {/* « First */}
        <button
          onClick={() => onChange(0)}
          disabled={page === 0}
          title="First page"
          className={`${btnBase} gap-0.5 border border-border/50 text-muted-foreground
                      hover:bg-muted/50 hover:text-foreground hover:border-border
                      disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <ChevronLeft className="w-3.5 h-3.5 -ml-2" />
        </button>

        {/* ‹ Prev */}
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 0}
          title="Previous page"
          className={`${btnBase} border border-border/50 text-muted-foreground
                      hover:bg-muted/50 hover:text-foreground hover:border-border
                      disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((p, i) => {
            if (typeof p === "string") {
              // Ellipsis
              return (
                <span
                  key={p}
                  className="min-w-[36px] h-9 flex items-center justify-center text-muted-foreground text-sm"
                >
                  ···
                </span>
              )
            }

            const isActive = p === currentPage
            return (
              <button
                key={p}
                onClick={() => onChange(p - 1)}   // convert back to 0-based
                title={`Page ${p}`}
                aria-current={isActive ? "page" : undefined}
                className={`${btnBase} border font-semibold
                  ${isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30 scale-105"
                    : "border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-border"
                  }`}
              >
                {p}
              </button>
            )
          })}
        </div>

        {/* › Next */}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages - 1}
          title="Next page"
          className={`${btnBase} border border-border/50 text-muted-foreground
                      hover:bg-muted/50 hover:text-foreground hover:border-border
                      disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* » Last */}
        <button
          onClick={() => onChange(totalPages - 1)}
          disabled={page === totalPages - 1}
          title="Last page"
          className={`${btnBase} gap-0.5 border border-border/50 text-muted-foreground
                      hover:bg-muted/50 hover:text-foreground hover:border-border
                      disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronRight className="w-3.5 h-3.5" />
          <ChevronRight className="w-3.5 h-3.5 -ml-2" />
        </button>
      </nav>

    </div>
  )
}

// ══════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════
const PAGE_SIZE = 6

export default function BlogsPage() {
  const [posts,       setPosts]       = useState([])
  const [categories,  setCategories]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)

  // filters
  const [search,      setSearch]      = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [category,    setCategory]    = useState("all")
  const [sortDir,     setSortDir]     = useState("desc")

  // pagination
  const [page,        setPage]        = useState(0)
  const [totalPages,  setTotalPages]  = useState(0)
  const [totalItems,  setTotalItems]  = useState(0)

  // ── Fetch categories once ──
  useEffect(() => {
    publicAxios.get("/categories")
      .then(r => setCategories(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
  }, [])

  // ── Fetch posts ──
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (search.trim()) {
        // Search endpoint (no pagination)
        const res = await publicAxios.get(`/posts/search?term=${encodeURIComponent(search.trim())}`)
        let data = Array.isArray(res.data) ? res.data : []
        if (category !== "all") data = data.filter(p => p.categoryName === category)
        if (sortDir === "asc") data = [...data].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
        setTotalItems(data.length)
        setTotalPages(Math.ceil(data.length / PAGE_SIZE))
        setPosts(data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE))
      } else {
        // Paginated endpoint
        const params = new URLSearchParams({
          page, size: PAGE_SIZE, sortBy: "createdAt", sortDir
        })
        const res = await publicAxios.get(`/posts?${params}`)
        const data = res.data
        let content = data.content || []
        if (category !== "all") {
          // client-side filter by category (backend doesn't have category filter param)
          const allRes = await publicAxios.get("/posts/all")
          const all = Array.isArray(allRes.data) ? allRes.data : []
          const filtered = all.filter(p => p.categoryName === category)
          if (sortDir === "asc") filtered.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
          setTotalItems(filtered.length)
          setTotalPages(Math.ceil(filtered.length / PAGE_SIZE))
          setPosts(filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE))
        } else {
          setTotalItems(data.totalElements || content.length)
          setTotalPages(data.totalPages || 1)
          setPosts(content)
        }
      }
    } catch (err) {
      const status = err?.response?.status
      if (status === 401) {
         setError("Unauthorized (401) — make sure GET /posts and /categories are public in SecurityConfig.")      } else if (status) {
        setError(`Server error ${status} — please check your backend`)
      } else {
        setError(`Server error ${status} — please check your backend.`)      }
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [page, search, category, sortDir])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  // reset page on filter change
  const handleCategory = (val) => { setCategory(val); setPage(0) }
  const handleSort     = (val) => { setSortDir(val);  setPage(0) }
  const handleSearch   = ()    => { setSearch(searchInput); setPage(0) }
  const clearFilters   = ()    => {
    setSearch(""); setSearchInput(""); setCategory("all"); setSortDir("desc"); setPage(0)
  }

  const hasFilters = search || category !== "all" || sortDir !== "desc"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-16">

        {/* ── Hero Header ── */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent pointer-events-none" />
          <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                                bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Live from backend
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">
                  Discover All{" "}
                  <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                    Blogs
                  </span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">
                  {loading ? "Loading articles…"
                    : `${totalItems.toLocaleString()} article${totalItems !== 1 ? "s" : ""} found`}
                </p>
              </div>
              {!loading && totalItems > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground
                                bg-muted/40 border border-border/40 rounded-xl px-4 py-2 w-fit">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Page {page + 1} of {totalPages}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Filters ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-border/40 space-y-4">

            {/* Search row */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  placeholder="Search blogs by title or keyword…"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/50
                             bg-muted/30 outline-none focus:border-primary focus:bg-background transition-colors"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold
                           hover:opacity-90 transition-opacity flex items-center gap-2 flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="px-3 py-2.5 rounded-xl border border-border/50 text-muted-foreground
                             hover:text-foreground hover:bg-muted/40 transition-colors flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category + Sort row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category pills */}
              <div className="flex gap-2 flex-wrap flex-1">
                <button
                  onClick={() => handleCategory("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all
                    ${category === "all"
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "border-border/50 text-muted-foreground hover:border-border hover:bg-muted/40"}`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.ID}
                    onClick={() => handleCategory(cat.catName)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all
                      ${category === cat.catName
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "border-border/50 text-muted-foreground hover:border-border hover:bg-muted/40"}`}
                  >
                    {cat.catName}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortDir}
                  onChange={e => handleSort(e.target.value)}
                  className="text-sm bg-muted/30 border border-border/50 rounded-xl px-3 py-2
                             outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 pt-1">
                {search && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs
                                   bg-primary/10 text-primary border border-primary/20 font-medium">
                    <Search className="w-3 h-3" /> "{search}"
                    <button onClick={() => { setSearch(""); setSearchInput(""); setPage(0) }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {category !== "all" && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs
                                   bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium">
                    <FolderOpen className="w-3 h-3" /> {category}
                    <button onClick={() => handleCategory("all")}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── Content ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          {/* Error */}
          {error && !loading && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30
                            text-red-500 rounded-2xl px-5 py-4 mb-6 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">{error}</p>
                <button onClick={fetchPosts} className="flex items-center gap-1 text-xs underline underline-offset-2">
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {Array(PAGE_SIZE).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {posts.map(post => <BlogCard key={post.ID} post={post} />)}
            </div>
          ) : !error ? (
            <div className="glass-card rounded-2xl p-14 text-center border border-border/40">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="font-semibold text-lg mb-1">Koi blog nahi mila</p>
              <p className="text-sm text-muted-foreground mb-5">
                {hasFilters ? "Filter change karo ya clear karo." : "No blogs have been published yet."}
              </p>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl border border-border/50 text-sm font-semibold
                             hover:bg-muted/40 transition-colors flex items-center gap-2 mx-auto">
                  <X className="w-4 h-4" /> Clear Filters
                </button>
              )}
            </div>
          ) : null}

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div className="mt-10 space-y-4">
              {/* Divider */}
              <div className="border-t border-border/40" />

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => {
                  setPage(p)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              />

              {/* Article count info */}
              <p className="text-center text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalItems)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">{totalItems}</span>{" "}
                articles &nbsp;·&nbsp; Page{" "}
                <span className="font-semibold text-foreground">{page + 1}</span> of{" "}
                <span className="font-semibold text-foreground">{totalPages}</span>
              </p>
            </div>
          )}
        </section>

      </main>
    </div>
  )
}