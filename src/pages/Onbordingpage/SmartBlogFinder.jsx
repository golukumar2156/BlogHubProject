import { useState, useEffect, useRef } from "react"
import { Search, Mic, MicOff, X, Sparkles, ArrowRight, Loader2, Volume2, BookOpen } from "lucide-react"
import { publicAxios } from "@/service/axiosInstance"
import { useNavigate } from "react-router-dom"

// ══════════════════════════════════════════════
// 🔍 Smart Blog Finder — Home Page AI Feature
// ══════════════════════════════════════════════
export default function SmartBlogFinder() {
  const navigate = useNavigate()
  const [open, setOpen]           = useState(false)
  const [query, setQuery]         = useState("")
  const [results, setResults]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const [listening, setListening] = useState(false)
  const [allPosts, setAllPosts]   = useState([])
  const [speaking, setSpeaking]   = useState(false)
  const [pulse, setPulse]         = useState(true)
  const inputRef       = useRef(null)
  const recognitionRef = useRef(null)
  const btnRef         = useRef(null)
  const dragState      = useRef({ dragging: false, startX: 0, startY: 0, moved: false })

  // Default position — bottom right (use left/top for smooth drag)
  const initLeft = typeof window !== "undefined" ? window.innerWidth - 160 : 900
  const initTop  = typeof window !== "undefined" ? window.innerHeight - 80 : 700
  const [pos, setPos] = useState({ left: initLeft, top: initTop })

  // ── Drag Logic — left/top based ──
  function onPointerDown(e) {
    dragState.current = {
      dragging: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      initLeft: pos.left,
      initTop:  pos.top,
    }
    btnRef.current?.setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  function onPointerMove(e) {
    if (!dragState.current.dragging) return
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragState.current.moved = true

    const btnW = btnRef.current?.offsetWidth  || 140
    const btnH = btnRef.current?.offsetHeight || 52
    const vw = window.innerWidth
    const vh = window.innerHeight

    let newLeft = dragState.current.initLeft + dx
    let newTop  = dragState.current.initTop  + dy

    newLeft = Math.max(8, Math.min(newLeft, vw - btnW - 8))
    newTop  = Math.max(8, Math.min(newTop,  vh - btnH - 8))

    setPos({ left: newLeft, top: newTop })
  }

  function onPointerUp() {
    if (!dragState.current.dragging) return
    dragState.current.dragging = false
    if (!dragState.current.moved) handleOpen()
  }

  // Fetch all posts once on mount
  useEffect(() => {
    publicAxios.get("/posts/all")
      .then((res) => setAllPosts(res.data || []))
      .catch(() => {})
  }, [])

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  // Voice Search setup
  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Your browser does not support voice search. Please use Chrome.")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = "hi-IN"
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onstart  = () => setListening(true)
    recognition.onend    = () => { setListening(false); recognitionRef.current = null }
    recognition.onerror  = () => { setListening(false); recognitionRef.current = null }

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript).join("")
      setQuery(transcript)
      if (e.results[0].isFinal) handleSearch(transcript)
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  function stopVoice() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  // AI Search — send all posts to Groq, get matching IDs back
  async function handleSearch(overrideQuery) {
    const q = overrideQuery ?? query
    if (!q.trim()) return
    setLoading(true)
    setResults(null)

    try {
      const postsSummary = allPosts.map((p, i) =>
        `ID:${p.ID || p.id} | Title:"${p.title}" | Category:${p.categoryName || "N/A"} | Words:${(p.content||"").split(" ").length}`
      ).join("\n")

      const res = await publicAxios.post("/ai/chat", {
        systemPrompt: `You are BlogHub's Smart Blog Finder AI.
The user will give a topic or keyword. Find the most relevant blogs from the list below.

AVAILABLE BLOGS:
${postsSummary}

RULES:
- Return only matching blog IDs (max 5)
- Response MUST be in this exact format, nothing else:
  MATCHES: id1,id2,id3
  REASON: One line explaining why these blogs match
- If no match found: MATCHES: NONE`,
        messages: [{ role: "user", content: `Find: "${q}"` }]
      })

      const reply = res.data?.reply || ""
      const matchLine  = reply.match(/MATCHES:\s*(.+)/i)?.[1]?.trim() || "NONE"
      const reasonLine = reply.match(/REASON:\s*(.+)/i)?.[1]?.trim() || ""

      if (matchLine === "NONE" || !matchLine) {
        setResults({ blogs: [], reason: reasonLine || "No matching blogs found." })
      } else {
        const ids = matchLine.split(",").map(id => id.trim().replace(/[^0-9]/g, "")).filter(Boolean)
        const matchedBlogs = ids
          .map(id => allPosts.find(p => String(p.ID || p.id) === String(id)))
          .filter(Boolean)
        setResults({ blogs: matchedBlogs, reason: reasonLine })
      }

      // Speak the reason
      if (reasonLine) speakText(reasonLine)

    } catch {
      setResults({ blogs: [], reason: "Unable to connect to AI. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  // TTS — speak result reason
  function speakText(text) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "hi-IN"
    utterance.rate = 1
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === "hi-IN" || v.lang.startsWith("hi"))
    if (hindiVoice) utterance.voice = hindiVoice
    utterance.onstart = () => setSpeaking(true)
    utterance.onend   = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }

  function handleOpen() {
    setOpen(true)
    setPulse(false)
  }

  function handleClose() {
    setOpen(false)
    setQuery("")
    setResults(null)
    stopSpeaking()
    stopVoice()
  }

  return (
    <>
      {/* ── Floating Button ── */}
      {/* ── Draggable Fancy Button ── */}
      <div
        ref={btnRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        aria-label="Smart Blog Finder"
        role="button"
        style={{
          position: "fixed",
          left: pos.left,
          top: pos.top,
          zIndex: 50,
          cursor: dragState.current?.dragging ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        {/* Outer rotating border ring */}
        <div className="btn-ring absolute -inset-[2px] rounded-[18px] z-0" />

        {/* Glow blur behind */}
        <div className="absolute inset-0 rounded-2xl opacity-70 blur-lg bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 btn-glow-anim" />

        {/* Main pill — works in dark AND light mode */}
        <div className="relative z-10 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl
          bg-white dark:bg-gray-950
          border border-cyan-400/50 dark:border-cyan-500/40
          shadow-xl shadow-cyan-500/20
          btn-float-anim
        ">

          {/* Icon bubble */}
          <div className="relative w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md shadow-cyan-500/30 btn-icon-bg">
            <Search className="w-4 h-4 text-white relative z-10" />
            {pulse && <span className="absolute inset-0 rounded-xl bg-white opacity-30 animate-ping" />}
          </div>

          {/* Text */}
          <div className="hidden sm:block">
            <p className="text-xs font-extrabold leading-none
              bg-gradient-to-r from-cyan-600 to-violet-600
              dark:from-cyan-400 dark:to-violet-400
              bg-clip-text text-transparent">
              AI Finder
            </p>
            <p className="text-[10px] mt-0.5 leading-none text-gray-500 dark:text-cyan-500/70">
              Blog dhundho ✦
            </p>
          </div>

          {/* Pulsing live dot */}
          <div className="relative hidden sm:flex items-center justify-center w-3 h-3">
            <span className="absolute inline-flex w-full h-full rounded-full bg-cyan-400 opacity-50 animate-ping" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-cyan-500" />
          </div>
        </div>
      </div>

      {/* ── Search Modal ── */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-4">

          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleClose} />

          {/* Panel */}
          <div className="modal-slide-up relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 dark:border-white/5 shadow-2xl"
            style={{ background: "linear-gradient(145deg, #0f172a 0%, #0c1628 50%, #0f0f23 100%)" }}>

            {/* Top gradient bar */}
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)", backgroundSize: "200% 100%", animation: "modal-bar-slide 3s linear infinite" }} />

            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-5 pb-4">
              {/* Icon */}
              <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}>
                <Sparkles className="w-5 h-5 text-white" />
                <span className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }} />
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-white text-base tracking-tight">AI Blog Finder</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#67e8f9" }}>
                  {allPosts.length > 0
                    ? `✦ Searching across ${allPosts.length} articles`
                    : "Loading articles..."}
                </p>
              </div>
              <button onClick={handleClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-5 pb-4">
              <div className="relative flex items-center gap-2 rounded-2xl px-4 py-3 transition-all search-input-box"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(6,182,212,0.3)" }}>
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#67e8f9" }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={listening ? "🎤 Listening... speak now" : "Search any topic, keyword or idea..."}
                  className="flex-1 bg-transparent outline-none text-sm text-white"
                  style={{ caretColor: "#06b6d4" }}
                />
                {/* Mic */}
                <button onClick={listening ? stopVoice : startVoice}
                  className="p-1.5 rounded-xl transition-all"
                  style={listening
                    ? { background: "rgba(239,68,68,0.2)", color: "#f87171" }
                    : { color: "rgba(255,255,255,0.4)" }}>
                  {listening
                    ? <MicOff className="w-4 h-4 animate-pulse" />
                    : <Mic className="w-4 h-4" />}
                </button>
                {/* Search btn */}
                <button onClick={() => handleSearch()}
                  disabled={!query.trim() || loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-30"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}>
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Search className="w-3 h-3" /> Search</>}
                </button>
              </div>

              {/* Quick Topic Chips */}
              {!results && !loading && (
                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Quick Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Technology", emoji: "💻" },
                      { label: "Motivation", emoji: "🔥" },
                      { label: "Life & Tips", emoji: "✨" },
                      { label: "Coding", emoji: "⚡" },
                      { label: "Design", emoji: "🎨" },
                      { label: "Business", emoji: "📈" },
                    ].map(({ label, emoji }) => (
                      <button key={label}
                        onClick={() => { setQuery(label); handleSearch(label) }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                        <span>{emoji}</span>{label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="px-5 pb-6 flex flex-col items-center gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 border-r-violet-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-fuchsia-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
                  <div className="absolute inset-4 rounded-full" style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)", opacity: 0.5 }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">AI is scanning articles...</p>
                  <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Finding the best matches for you</p>
                </div>
              </div>
            )}

            {/* Results */}
            {results && !loading && (
              <div className="px-5 pb-5 space-y-3">

                {/* AI Insight bar */}
                {results.reason && (
                  <div className="flex items-start gap-3 rounded-2xl px-4 py-3"
                    style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))", border: "1px solid rgba(6,182,212,0.2)" }}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}>
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-xs flex-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{results.reason}</p>
                    <button onClick={speaking ? stopSpeaking : () => speakText(results.reason)}
                      className="flex-shrink-0 p-1.5 rounded-lg transition-all hover:scale-110"
                      style={speaking
                        ? { background: "rgba(6,182,212,0.2)", color: "#06b6d4" }
                        : { color: "rgba(255,255,255,0.3)" }}>
                      <Volume2 className={`w-3.5 h-3.5 ${speaking ? "animate-pulse" : ""}`} />
                    </button>
                  </div>
                )}

                {/* Result count */}
                {results.blogs.length > 0 && (
                  <p className="text-[11px] font-semibold uppercase tracking-widest px-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {results.blogs.length} result{results.blogs.length > 1 ? "s" : ""} found
                  </p>
                )}

                {/* Blog Cards */}
                {results.blogs.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5 finder-scroll">
                    {results.blogs.map((blog, idx) => {
                      const date = blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" })
                        : null
                      const colors = [
                        "from-cyan-500 to-blue-600",
                        "from-violet-500 to-purple-600",
                        "from-fuchsia-500 to-pink-600",
                        "from-emerald-500 to-teal-600",
                        "from-amber-500 to-orange-600",
                      ]
                      return (
                        <button
                          key={blog.ID || blog.id}
                          onClick={() => { navigate(`/blog/${blog.ID || blog.id}`); handleClose() }}
                          className="w-full text-left flex items-center gap-3 p-3 rounded-2xl transition-all group hover:scale-[1.01]"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(6,182,212,0.08)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                        >
                          {/* Number badge */}
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center flex-shrink-0 text-xs font-bold text-white shadow-lg`}>
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold line-clamp-1 text-white group-hover:text-cyan-300 transition-colors">{blog.title}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {blog.categoryName && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                  style={{ background: "rgba(6,182,212,0.15)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.2)" }}>
                                  {blog.categoryName}
                                </span>
                              )}
                              {blog.authorName && (
                                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                                  by {blog.authorName}
                                </span>
                              )}
                              {date && (
                                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>{date}</span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 flex-shrink-0 transition-all group-hover:translate-x-1" style={{ color: "rgba(255,255,255,0.25)" }} />
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.05)" }}>
                      <BookOpen className="w-7 h-7" style={{ color: "rgba(255,255,255,0.2)" }} />
                    </div>
                    <p className="text-sm font-semibold text-white">No articles found</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Try a different keyword or topic</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* ── Floating Button Styles ── */
        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        .btn-ring {
          background: conic-gradient(from var(--angle, 0deg), #06b6d4, #8b5cf6, #ec4899, #06b6d4);
          animation: btn-spin 3s linear infinite;
          border-radius: 18px;
        }
        @keyframes btn-spin { to { --angle: 360deg; } }

        .btn-icon-bg { background: linear-gradient(135deg, #06b6d4, #8b5cf6); }

        @keyframes btn-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        .btn-float-anim { animation: btn-float 2.8s ease-in-out infinite; }

        @keyframes btn-glow {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.8; }
        }
        .btn-glow-anim { animation: btn-glow 3s ease-in-out infinite; }

        /* ── Modal Styles ── */
        @keyframes modal-slide-up {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1); }
        }
        .modal-slide-up { animation: modal-slide-up 0.28s cubic-bezier(.16,1,.3,1) forwards; }

        @keyframes modal-bar-slide {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        /* Scrollbar for results */
        .finder-scroll::-webkit-scrollbar { width: 4px; }
        .finder-scroll::-webkit-scrollbar-track { background: transparent; }
        .finder-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #06b6d4, #8b5cf6);
          border-radius: 99px;
        }
      `}</style>
    </>
  )
}