import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, User, Tag, Share2, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "../Onbordingpage/Navbar"
import { publicAxios } from "@/service/axiosInstance"

// ── Reading time estimate ──
function readingTime(text = "") {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// ── Gradient avatar based on initials ──
function Avatar({ name, size = "md" }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const colors = [
    "from-violet-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-cyan-500 to-blue-500",
  ]
  const color = colors[name.charCodeAt(0) % colors.length]
  const sz = size === "lg" ? "w-14 h-14 text-base" : "w-10 h-10 text-sm"

  return (
    <div className={`${sz} bg-gradient-to-br ${color} rounded-full flex items-center justify-center shrink-0 font-bold text-white shadow-lg`}>
      {initials}
    </div>
  )
}

// ── Hero placeholder — beautiful gradient when no image ──
function HeroSection({ imageUrl, title, categoryName }) {
  if (imageUrl) {
    return (
      <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-2xl">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
      </div>
    )
  }

  // No image — gorgeous gradient placeholder
  return (
    <div className="relative w-full h-56 md:h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent to-secondary/30 flex items-center justify-center">
      {/* Decorative circles */}
      <div className="absolute top-6 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute bottom-6 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/10 rounded-full blur-xl" />

      <div className="relative z-10 flex flex-col items-center gap-3 text-center px-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center backdrop-blur-sm">
          <BookOpen className="w-7 h-7 text-primary" />
        </div>
        {categoryName && (
          <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">
            {categoryName}
          </span>
        )}
      </div>
    </div>
  )
}

export default function BlogDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [copied, setCopied]   = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    publicAxios
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => {
        const status = err?.response?.status
        if (status === 404)      setError("Yeh post nahi mili.")
        else if (status === 401) setError("Server error 401 — GET /posts/{id} ko permitAll karo SecurityConfig mein.")
        else                     setError("Post load nahi ho paya. Backend check karo.")
      })
      .finally(() => setLoading(false))
  }, [id])

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-20 animate-pulse space-y-6">
          <div className="h-5 w-24 bg-muted rounded-full" />
          <div className="h-56 bg-muted rounded-2xl" />
          <div className="h-6 w-20 bg-muted rounded-full" />
          <div className="h-12 bg-muted rounded-xl" />
          <div className="h-4 w-48 bg-muted rounded" />
          <div className="space-y-3 pt-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-4 bg-muted rounded" style={{ width: `${75 + (i % 3) * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Error ──
  if (error || !post) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 pt-40 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-muted-foreground">{error || "Post nahi mili."}</p>
          <Button variant="outline" onClick={() => navigate("/blogs")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Wapas Blogs pe
          </Button>
        </div>
      </div>
    )
  }

  // ── Helpers ──
  const authorName    = post.authorName || post.author?.name || post.author || "Unknown Author"
  const categoryName  = post.categoryName || post.category?.catName || post.category || null
  const imageUrl      = post.imageUrl || post.image || post.coverImage || null
  const createdAt     = post.createdAt || post.publishedAt || null
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null
  const mins = readingTime(post.content || "")

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      <main className="pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">

          {/* ── Back ── */}
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to all blogs
          </button>

          {/* ── Hero ── */}
          <HeroSection imageUrl={imageUrl} title={post.title} categoryName={categoryName} />

          {/* ── Meta row ── */}
          <div className="flex flex-wrap items-center gap-3 mt-6 mb-4">
            {categoryName && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                <Tag className="w-3 h-3" />
                {categoryName}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {mins} min read
            </span>
            {formattedDate && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            )}
          </div>

          {/* ── Title ── */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          {/* ── Author + Share bar ── */}
          <div className="flex items-center justify-between py-5 mb-8 border-y border-border/60">
            <div className="flex items-center gap-3">
              <Avatar name={authorName} size="md" />
              <div>
                <p className="font-semibold text-sm">{authorName}</p>
                <p className="text-xs text-muted-foreground">Author</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40 transition-all"
            >
              <Share2 className="w-4 h-4" />
              {copied ? "Copied!" : "Share"}
            </button>
          </div>

          {/* ── Article body ── */}
          <article className="prose prose-neutral dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-p:leading-relaxed prose-p:text-foreground/85
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
            mb-16">
            {post.content
              ? post.content.split("\n").map((para, i) =>
                  para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                )
              : <p className="text-muted-foreground italic">Content unavailable.</p>
            }
          </article>

          {/* ── Author card at bottom ── */}
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-6 flex items-start gap-5">
            <Avatar name={authorName} size="lg" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Written by</p>
              <p className="font-bold text-lg leading-tight">{authorName}</p>
              <p className="text-sm text-muted-foreground mt-1">BlogHub Author</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}