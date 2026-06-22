import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Navbar } from "@/pages/Onbordingpage/Navbar"
import { fetchAllCategories } from "@/Features/auth/categoryThunk"
import {
  FolderOpen, ArrowRight, BookOpen,
  Layers, RefreshCw, Sparkles, Tag,
  Search, ChevronRight
} from "lucide-react"

// ── Gradient palette ──
const PALETTES = [
  { gradient: "from-violet-500 to-indigo-600",   pill: "bg-violet-500/10 text-violet-500 border-violet-500/20"  },
  { gradient: "from-cyan-500 to-blue-600",        pill: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"        },
  { gradient: "from-emerald-500 to-teal-600",     pill: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"},
  { gradient: "from-rose-500 to-pink-600",        pill: "bg-rose-500/10 text-rose-500 border-rose-500/20"        },
  { gradient: "from-amber-500 to-orange-600",     pill: "bg-amber-500/10 text-amber-500 border-amber-500/20"     },
  { gradient: "from-fuchsia-500 to-purple-600",   pill: "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20"},
  { gradient: "from-sky-500 to-cyan-600",         pill: "bg-sky-500/10 text-sky-500 border-sky-500/20"           },
  { gradient: "from-lime-500 to-green-600",       pill: "bg-lime-500/10 text-lime-500 border-lime-500/20"        },
]

function getPalette(name = "") {
  let h = 0
  for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h)
  return PALETTES[Math.abs(h) % PALETTES.length]
}

// ── Category Card ──
function CategoryCard({ cat, index, onClick }) {
  const p = getPalette(cat.catName)
  return (
    <div
      onClick={() => onClick(cat.catName)}
      className="group relative rounded-2xl border border-border/50 bg-card overflow-hidden
                 cursor-pointer flex flex-col
                 hover:border-border hover:shadow-2xl hover:shadow-black/10
                 hover:-translate-y-1.5 active:scale-[0.98]
                 transition-all duration-300 ease-out"
    >
      {/* Gradient banner */}
      <div className={`relative h-36 sm:h-40 bg-gradient-to-br ${p.gradient} overflow-hidden flex-shrink-0`}>
        {/* Blobs */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-black/10 blur-lg" />

        {/* Faint index */}
        <span className="absolute bottom-2 right-4 text-7xl font-black text-white/[0.08] leading-none select-none pointer-events-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/10
                          flex items-center justify-center">
            <Tag className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">
              Category
            </p>
            <h3 className="text-white text-lg sm:text-xl font-extrabold leading-tight drop-shadow-sm">
              {cat.catName}
            </h3>
          </div>
        </div>

        {/* Hover shimmer */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.06] transition-all duration-300" />
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-4">
          {cat.Description || cat.description
            || `Explore all articles published under ${cat.catName}.`}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                            text-xs font-semibold border ${p.pill}`}>
            <BookOpen className="w-3 h-3" />
            Browse Articles
          </span>
          <div className="w-7 h-7 rounded-full bg-muted/50 border border-border/40
                          flex items-center justify-center
                          group-hover:bg-primary group-hover:border-primary
                          group-hover:text-primary-foreground transition-all duration-200">
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Skeleton ──
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/40 overflow-hidden animate-pulse">
      <div className="h-36 sm:h-40 bg-muted/50" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-muted/50 rounded-full w-4/5" />
        <div className="h-3 bg-muted/50 rounded-full w-full" />
        <div className="h-3 bg-muted/50 rounded-full w-2/3" />
        <div className="h-7 bg-muted/40 rounded-full w-2/5 mt-5" />
      </div>
    </div>
  )
}

// ── Why cards ──
const WHY = [
  { icon: Layers,   color: "text-violet-500", bg: "bg-violet-500/10", title: "Focused Learning",      desc: "Find exactly what you're looking for with organized, topic-specific content."       },
  { icon: Sparkles, color: "text-cyan-500",   bg: "bg-cyan-500/10",   title: "Discover New Insights", desc: "Explore different perspectives and deep dives within your areas of interest."        },
  { icon: BookOpen, color: "text-emerald-500",bg: "bg-emerald-500/10",title: "Stay Updated",          desc: "Get the latest posts from your favorite categories and never miss new content." },
]

// ══════════════════════════════════════
export default function CategoriesPage() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { categories, loading, error } = useSelector((s) => s.category)
  const [query, setQuery] = useState("")

  useEffect(() => { dispatch(fetchAllCategories()) }, [dispatch])

  const filtered = categories.filter(c =>
    c.catName?.toLowerCase().includes(query.toLowerCase())
  )

  const handleClick = (catName) =>
    navigate(`/blogs?category=${encodeURIComponent(catName)}`)

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      <main className="pt-16">

        {/* ══ HERO ══ */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-72 h-72 rounded-full bg-violet-500/6 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-primary/10 border border-primary/20 text-primary text-xs font-bold
                            tracking-wide mb-5">
              <FolderOpen className="w-3.5 h-3.5" />
              All Categories
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.1]">
              Browse by{" "}
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                Category
              </span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
              {loading
                ? "Loading categories…"
                : `Discover content across ${categories.length} topic area${categories.length !== 1 ? "s" : ""}. Click any category to explore its articles.`}
            </p>

            {/* Search bar */}
            {!loading && categories.length > 0 && (
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search categories…"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/50
                             bg-background/80 backdrop-blur-sm text-sm
                             outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
                             transition-all placeholder:text-muted-foreground/60"
                />
              </div>
            )}
          </div>
        </section>

        {/* ══ GRID ══ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="max-w-sm mx-auto text-center py-24 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
                <FolderOpen className="w-8 h-8 text-destructive/70" />
              </div>
              <div>
                <p className="font-semibold mb-1">Failed to load categories</p>
                <p className="text-sm text-muted-foreground">Please check your backend.</p>
              </div>
              <button
                onClick={() => dispatch(fetchAllCategories())}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/50
                           text-sm font-semibold hover:bg-muted/40 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && categories.length === 0 && (
            <div className="max-w-sm mx-auto text-center py-24 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                <FolderOpen className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="font-semibold">No categories yet</p>
              <p className="text-sm text-muted-foreground">Admin categories add karega tab yahan dikhenge.</p>
            </div>
          )}

          {/* No search result */}
          {!loading && !error && categories.length > 0 && filtered.length === 0 && (
            <div className="text-center py-20 space-y-3">
              <p className="font-semibold">No categories found for "{query}"</p>
              <button onClick={() => setQuery("")} className="text-sm text-primary underline underline-offset-2">
                Clear search
              </button>
            </div>
          )}

          {/* Cards */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((cat, i) => (
                <CategoryCard key={cat.ID} cat={cat} index={i} onClick={handleClick} />
              ))}
            </div>
          )}
        </section>

        {/* ══ STATS + VIEW ALL ══ */}
        {!loading && !error && categories.length > 0 && (
          <section className="border-y border-border/40 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

                {/* Stats */}
                <div className="flex items-center gap-8 sm:gap-12">
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                      {categories.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wide">Categories</p>
                  </div>
                  <div className="w-px h-10 bg-border/60" />
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                      ∞
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wide">Articles</p>
                  </div>
                </div>

                {/* View All Posts CTA */}
                <button
                  onClick={() => navigate("/blogs")}
                  className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl
                             bg-primary text-primary-foreground font-semibold text-sm
                             hover:opacity-90 active:scale-[0.97]
                             shadow-lg shadow-primary/25 hover:shadow-primary/40
                             transition-all duration-200"
                >
                  <BookOpen className="w-4 h-4" />
                  View All Posts
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

              </div>
            </div>
          </section>
        )}

        {/* ══ WHY SECTION ══ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Why Browse by Category?</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Organized reading helps you learn faster and discover more relevant content.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {WHY.map((item, i) => (
              <div key={i}
                className="rounded-2xl border border-border/50 bg-card p-6 sm:p-7
                           hover:border-border hover:shadow-xl hover:shadow-black/5
                           hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center mb-5
                                 group-hover:scale-110 transition-transform duration-200`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}