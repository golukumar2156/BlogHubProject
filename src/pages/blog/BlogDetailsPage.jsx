import { useEffect, useRef, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft, Calendar, Tag, Share2, Clock, BookOpen,
  Sparkles, X, Send, Bot, Volume2, VolumeX, Play, Pause, Square, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "../Onbordingpage/Navbar"
import { publicAxios } from "@/service/axiosInstance"

// ── Reading time estimate ──
function readingTime(text = "") {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// ── Gradient avatar ──
function Avatar({ name, size = "md" }) {
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
  const colors = [
    "from-violet-500 to-indigo-500", "from-pink-500 to-rose-500",
    "from-emerald-500 to-teal-500", "from-orange-500 to-amber-500", "from-cyan-500 to-blue-500",
  ]
  const color = colors[name.charCodeAt(0) % colors.length]
  const sz = size === "lg" ? "w-14 h-14 text-base" : "w-10 h-10 text-sm"
  return (
    <div className={`${sz} bg-gradient-to-br ${color} rounded-full flex items-center justify-center shrink-0 font-bold text-white shadow-lg`}>
      {initials}
    </div>
  )
}

// ── Hero Section ──
function HeroSection({ imageUrl, title, categoryName }) {
  if (imageUrl) {
    return (
      <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-2xl">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
      </div>
    )
  }
  return (
    <div className="relative w-full h-56 md:h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent to-secondary/30 flex items-center justify-center">
      <div className="absolute top-6 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute bottom-6 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center px-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center backdrop-blur-sm">
          <BookOpen className="w-7 h-7 text-primary" />
        </div>
        {categoryName && (
          <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">{categoryName}</span>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// 🔊 AI Audio Player Component
// ══════════════════════════════════════════════
function AIAudioPlayer({ post }) {
  const [state, setState] = useState("idle") // idle | loading | ready | playing | paused | error
  const [aiSummary, setAiSummary] = useState(null)
  const [progress, setProgress] = useState(0)
  const [speed, setSpeed] = useState(1)
  const utteranceRef = useRef(null)
  const intervalRef = useRef(null)
  const charIndexRef = useRef(0)

  // Fetch AI summary from backend
  async function fetchAISummary() {
    setState("loading")
    try {
      const res = await publicAxios.post("/ai/chat", {
        systemPrompt: `You are a helpful blog summarizer.
The user will give you a blog. Create a clear, natural English summary of it.
Rules:
- Write only in English
- Give the summary in 5-7 sentences
- Use simple and easy English
- Avoid unnecessary jargon
- The summary should sound natural, like a friend explaining it`,
        messages: [
          {
            role: "user",
            content: `Create a summary of this blog:\n\nTitle: ${post.title}\n\nContent:\n${post.content || "Content not available."}`,
          },
        ],
      })
      const summary = res.data?.reply || res.data?.message
      if (!summary) throw new Error("No summary returned")
      setAiSummary(summary)
      setState("ready")
      return summary
    } catch (err) {
      setState("error")
      return null
    }
  }

  function startSpeech(text) {
    if (!window.speechSynthesis) {
      setState("error")
      return
    }
    window.speechSynthesis.cancel()
    charIndexRef.current = 0

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "hi-IN"
    utterance.rate = speed
    utterance.pitch = 1.05
    utterance.volume = 1

    // Try to pick a suitable voice
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(
      (v) => v.lang === "hi-IN" || v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi")
    )
    if (hindiVoice) utterance.voice = hindiVoice

    utterance.onboundary = (e) => {
      if (e.name === "word") {
        charIndexRef.current = e.charIndex
        setProgress(Math.round((e.charIndex / text.length) * 100))
      }
    }

    utterance.onend = () => {
      setState("ready")
      setProgress(100)
      clearInterval(intervalRef.current)
    }

    utterance.onerror = () => {
      setState("error")
      clearInterval(intervalRef.current)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setState("playing")
  }

  async function handlePlay() {
    if (state === "paused") {
      window.speechSynthesis.resume()
      setState("playing")
      return
    }
    if (state === "ready" && aiSummary) {
      setProgress(0)
      startSpeech(aiSummary)
      return
    }
    // idle or error — fetch first
    const summary = await fetchAISummary()
    if (summary) {
      setProgress(0)
      startSpeech(summary)
    }
  }

  function handlePause() {
    window.speechSynthesis.pause()
    setState("paused")
  }

  function handleStop() {
    window.speechSynthesis.cancel()
    setState(aiSummary ? "ready" : "idle")
    setProgress(0)
  }

  function handleSpeedChange(newSpeed) {
    setSpeed(newSpeed)
    if (state === "playing" && aiSummary) {
      window.speechSynthesis.cancel()
      setTimeout(() => startSpeech(aiSummary), 50)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
      clearInterval(intervalRef.current)
    }
  }, [])

  const isPlaying = state === "playing"
  const isLoading = state === "loading"
  const isError   = state === "error"
  const hasAudio  = state === "ready" || state === "playing" || state === "paused"

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 p-5 mb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
          <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">AI Audio Summary</p>
          <p className="text-[11px] text-muted-foreground">Listen to the blog summary</p>
        </div>
        {isError && (
          <span className="ml-auto text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
            Error occurred, please try again
          </span>
        )}
      </div>

      {/* AI summary text (show when ready) */}
      {aiSummary && (
        <div className="mb-4 bg-muted/40 rounded-xl p-3 text-sm text-foreground/80 leading-relaxed border border-border/40 max-h-28 overflow-y-auto">
          {aiSummary}
        </div>
      )}

      {/* Progress bar */}
      {hasAudio && (
        <div className="mb-4">
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>{progress}%</span>
            <span>{state === "playing" ? "▶ Playing..." : state === "paused" ? "⏸ Paused" : "✅ Complete"}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause button */}
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          disabled={isLoading}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
            ${isLoading
              ? "bg-muted text-muted-foreground cursor-wait"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90 active:scale-95 shadow-md"}
          `}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating summary...</>
          ) : isPlaying ? (
            <><Pause className="w-4 h-4" /> Pause</>
          ) : state === "paused" ? (
            <><Play className="w-4 h-4" /> Continue</>
          ) : (
            <><Play className="w-4 h-4" /> {aiSummary ? "Play Again" : "Play"}</>
          )}
        </button>

        {/* Stop button */}
        {(isPlaying || state === "paused") && (
          <button
            onClick={handleStop}
            className="p-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
          >
            <Square className="w-4 h-4" />
          </button>
        )}

        {/* Speed selector */}
        {hasAudio && (
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[11px] text-muted-foreground mr-1">Speed:</span>
            {[0.75, 1, 1.25, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`text-[11px] px-2 py-1 rounded-lg transition-all ${
                  speed === s
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// 🤖 AI Agent Floating Button + Panel
// ══════════════════════════════════════════════
function AIAgent({ post }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [authorPosts, setAuthorPosts] = useState(null) // null = loading, [] = no posts
  const bottomRef = useRef(null)

  // When component mounts — fetch all posts by this author
  useEffect(() => {
    const authorId = post.authorID || post.authorId || post.author?.id
    if (!authorId) { setAuthorPosts([]); return }
    publicAxios
      .get(`/posts/author/${authorId}`)
      .then((res) => setAuthorPosts(res.data || []))
      .catch(() => setAuthorPosts([]))
  }, [post])

  function toggleOpen() {
    setOpen((v) => !v)
    if (messages.length === 0) {
      setMessages([{
        role: "assistant",
        text: `👋 Hello! I am the AI Agent for all blogs by ${post.authorName || "this author"}.\n\nAuthor ke total posts, popular blogs, categories — sab poochh sakte ho! 🚀`,
      }])
    }
  }

  async function sendMessage(customText) {
    const userText = customText ?? input.trim()
    if (!userText || loading) return
    setInput("")
    const newMessages = [...messages, { role: "user", text: userText }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const authorName   = post.authorName || post.author?.name || "Unknown"
      const categoryName = post.categoryName || post.category?.catName || "General"
      const createdAt    = post.createdAt || post.publishedAt || null
      const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : "Unknown"
      const totalWords = (post.content || "").trim().split(/\s+/).length
      const readMins   = Math.max(1, Math.ceil(totalWords / 200))

      // Details of all author posts
      const posts = authorPosts || []
      const totalPosts = posts.length

      // Popular post = one with most words (views not available in backend)
      const popularPost = posts.reduce((max, p) => {
        const w = (p.content || "").trim().split(/\s+/).length
        return w > ((max.content || "").trim().split(/\s+/).length) ? p : max
      }, posts[0] || null)

      // Latest post
      const latestPost = [...posts].sort((a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )[0] || null

      // Unique categories
      const uniqueCategories = [...new Set(posts.map(p => p.categoryName).filter(Boolean))]

      // Numbered list of all posts
      const postsList = posts.length > 0
        ? posts.map((p, i) => {
            const d = p.createdAt
              ? new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
              : "Date N/A"
            const w = (p.content || "").trim().split(/\s+/).length
            return `  ${i + 1}. "${p.title}"\n     Category: ${p.categoryName || "N/A"} | Published: ${d} | Words: ${w}`
          }).join("\n")
        : "  No other posts found."

      const systemContext = `You are BlogHub's helpful AI agent.
You have complete information about all posts by this author. Answer confidently.

=== CURRENT POST ===
Title: "${post.title}"
Category: "${categoryName}"
Published: "${formattedDate}"
Reading Time: "${readMins} min"
Words: "${totalWords}"

=== AUTHOR INFO ===
Name: "${authorName}"
Total Posts Written: ${totalPosts}
All Categories: ${uniqueCategories.join(", ") || "N/A"}
Most Popular Post (by word count): "${popularPost?.title || "N/A"}"
Latest Post: "${latestPost?.title || "N/A"}"

=== ALL ${totalPosts} POSTS BY THIS AUTHOR ===
${postsList}

=== CURRENT POST CONTENT ===
${post.content || "Content not available."}

=== RULES ===
- "How many posts" => "${totalPosts} posts" + show list
- "Popular/famous post" => "${popularPost?.title || "N/A"}" show it
- "Latest post" => "${latestPost?.title || "N/A"}" show it
- "Which categories" => "${uniqueCategories.join(", ")}" show them
- "When created" => "${formattedDate}" show it
- Only talk about this author and their posts
- Reply in English
- Max 200 words, be clear and friendly`

      const historyMessages = newMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }))

      const res = await publicAxios.post("/ai/chat", {
        systemPrompt: systemContext,
        messages: historyMessages,
      })
      const aiReply = res.data?.reply || res.data?.message || "No response received."
      setMessages((prev) => [...prev, { role: "assistant", text: aiReply }])
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        text: "⚠️ Unable to connect to AI. Please check the backend.",
      }])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const quickActions = [
    "📊 How many posts has this author written?",
    "🏆 What is the most popular post?",
    "📝 Is blog ki summary do",
    "📂 Which categories has the author written in?",
  ]

  return (
    <>
      {/* Floating Circle Button */}
      <button
        onClick={toggleOpen}
        aria-label="AI Agent"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ animation: "ai-pulse 2s infinite" }}
      >
        {open ? <X className="w-5 h-5" /> : <Sparkles className="w-6 h-6" />}
        {!open && <span className="absolute inset-0 rounded-full bg-violet-500 opacity-30 animate-ping" />}
        {/* Loading dot — author posts fetch ho rahe hain */}
        {authorPosts === null && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-background animate-pulse" />
        )}
      </button>

      {/* AI Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-[340px] sm:w-[380px] max-h-[560px] rounded-2xl border border-violet-500/20 bg-background/95 backdrop-blur-xl shadow-2xl shadow-violet-500/10 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600/90 to-indigo-600/90">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Blog AI Agent</p>
              <p className="text-[11px] text-white/70">
                {authorPosts === null
                  ? "Loading posts..."
                  : `${post.authorName || "Author"} ke ${authorPosts.length} posts ready`}
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm border border-border/60"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  className="text-[11px] px-2.5 py-1.5 rounded-full border border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-border/60">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything..."
              className="flex-1 bg-muted/60 rounded-xl px-3 py-2 text-sm outline-none border border-border/40 focus:border-violet-500/50 transition-colors placeholder:text-muted-foreground/60"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ai-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(139, 92, 246, 0); }
        }
      `}</style>
    </>
  )
}

// ══════════════════════════════════════════════
// 🏠 Main Page
// ══════════════════════════════════════════════
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
    publicAxios.get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => {
        const status = err?.response?.status
        if (status === 404)      setError("This post was not found.")
        else if (status === 401) setError("Unauthorized (401) — make sure GET /posts/{id} is public in SecurityConfig.")
        else                     setError("Failed to load this post. Please check your backend.")
      })
      .finally(() => setLoading(false))
  }, [id])

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

  if (error || !post) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 pt-40 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-muted-foreground">{error || "Post not found."}</p>
          <Button variant="outline" onClick={() => navigate("/blogs")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
          </Button>
        </div>
      </div>
    )
  }

  const authorName   = post.authorName || post.author?.name || post.author || "Unknown Author"
  const categoryName = post.categoryName || post.category?.catName || post.category || null
  const rawImageUrl  = post.imageUrl || post.image || post.coverImage || null
  const imageUrl     = rawImageUrl && rawImageUrl.startsWith("/uploads")
                       ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:7000"}${rawImageUrl}`
                       : rawImageUrl
  const createdAt    = post.createdAt || post.publishedAt || null
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null
  const mins = readingTime(post.content || "")

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      <main className="pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">

          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to all blogs
          </button>

          <HeroSection imageUrl={imageUrl} title={post.title} categoryName={categoryName} />

          <div className="flex flex-wrap items-center gap-3 mt-6 mb-4">
            {categoryName && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                <Tag className="w-3 h-3" />{categoryName}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />{mins} min read
            </span>
            {formattedDate && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />{formattedDate}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

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

          {/* 🔊 AI Audio Player — article se upar */}
          <AIAudioPlayer post={post} />

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

      {/* 🤖 AI Floating Agent */}
      {post && <AIAgent post={post} />}
    </div>
  )
}