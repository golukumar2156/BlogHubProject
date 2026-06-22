import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import Sidebar from "./Sidebar"
import axiosInstance from "@/service/axiosInstance"
import {
  Trash2, Edit2, Search, CheckCircle, AlertCircle,
  X, PlusCircle, BookOpen, FileText, Clock,
  Loader2, RefreshCw, FolderOpen, ImagePlus,
  ChevronLeft, ChevronRight, Sparkles,
} from "lucide-react"

const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 sticky top-0 bg-background z-10">
        <h2 className="text-base font-bold">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
)

function BlogForm({ form, setForm, categories, onSubmit, submitLabel, submitting }) {
  // ── Title AI states ──
  const [titleSuggestions,     setTitleSuggestions]     = useState([])
  const [titleSuggestLoading,  setTitleSuggestLoading]  = useState(false)
  const titleDebounceRef = useRef(null)

  // ── Content AI states ──
  const [contentSuggestion,    setContentSuggestion]    = useState("")
  const [contentSuggestLoading,setContentSuggestLoading]= useState(false)
  const contentDebounceRef = useRef(null)
  const textareaRef = useRef(null)

  // ─────────────────────────────────────────────────
  // TITLE: type karte waqt real-time suggest
  // ─────────────────────────────────────────────────
  const handleTitleChange = (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, title: value }))
    setTitleSuggestions([])

    if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current)

    // Suggest after minimum 10 characters
    if (value.trim().length < 10) return

    titleDebounceRef.current = setTimeout(async () => {
      setTitleSuggestLoading(true)
      try {
        // If content is also present, include it, otherwise use only title
        const contextContent = form.content.trim()
          ? form.content
          : `Blog topic: ${value}`

        const res = await axiosInstance.post("/ai/suggest-titles", {
          content: contextContent,
        })

        const lines = (res.data.titles || "")
          .split("\n")
          .map((l) => l.replace(/^\d+[\.\)]\s*/, "").replace(/\*\*/g, "").trim())
          .filter((l) => l.length > 5)
          .slice(0, 5)

        setTitleSuggestions(lines)
      } catch {
        // silent
      } finally {
        setTitleSuggestLoading(false)
      }
    }, 900) // 900ms debounce — type karne ke baad thoda ruko
  }

  // ─────────────────────────────────────────────────
  // CONTENT: type karte waqt VS Code jaise suggest
  // ─────────────────────────────────────────────────
  const handleContentChange = (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, content: value }))
    setContentSuggestion("")

    if (contentDebounceRef.current) clearTimeout(contentDebounceRef.current)

    // Suggest after minimum 1 word is typed
    if (value.trim().length < 3) return

    contentDebounceRef.current = setTimeout(async () => {
      setContentSuggestLoading(true)
      try {
        // Include title as context — gives better suggestions
        const titleContext = form.title.trim()
          ? `Blog Title: "${form.title}"\n\nContent so far:\n`
          : ""

        const res = await axiosInstance.post("/ai/suggest-content", {
          content: titleContext + value,
        })

        // Backend returns { suggestion: "..." }
        const suggestion = (res.data.suggestion || "")
          .replace(/\*\*/g, "")
          .trim()
          .split("\n")[0] // take only the first line

        if (suggestion && suggestion.length > 3) {
          setContentSuggestion(suggestion)
        }
      } catch {
        // silent
      } finally {
        setContentSuggestLoading(false)
      }
    }, 600) // 600ms debounce — fast suggest
  }

  // Tab = accept, Escape = dismiss
  const handleContentKeyDown = (e) => {
    if (e.key === "Tab" && contentSuggestion) {
      e.preventDefault()
      setForm((prev) => ({ ...prev, content: prev.content + " " + contentSuggestion }))
      setContentSuggestion("")
    }
    if (e.key === "Escape") {
      setContentSuggestion("")
      setTitleSuggestions([])
    }
  }

  return (
    <div className="space-y-4">

      {/* ── TITLE ── */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
          Title
        </label>

        <div className="relative">
          <input
            className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm
                       outline-none focus:border-primary focus:bg-background transition-colors pr-10"
            placeholder="Type your blog title..."
            value={form.title}
            onChange={handleTitleChange}
          />
          {/* Loading spinner inside input */}
          {titleSuggestLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
            </div>
          )}
        </div>

        {/* Title AI suggestions — type karte waqt neeche aate hain */}
        {titleSuggestions.length > 0 && (
          <div className="mt-2 rounded-xl border border-violet-500/20 bg-violet-500/5 overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-violet-500/10">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <p className="text-xs text-violet-400 font-medium">AI Title Suggestions — click to use</p>
              <button
                type="button"
                onClick={() => setTitleSuggestions([])}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            {titleSuggestions.map((title, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, title }))
                  setTitleSuggestions([])
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-violet-500/10
                           hover:text-violet-300 transition-colors border-b border-violet-500/10
                           last:border-0 text-foreground/80"
              >
                <span className="text-violet-400/60 mr-2">{i + 1}.</span>
                {title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── CATEGORY ── */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
          Category
        </label>
        <select
          className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm
                     outline-none focus:border-primary focus:bg-background transition-colors"
          value={form.categoryId}
          onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.ID} value={cat.ID}>{cat.catName}</option>
          ))}
        </select>
      </div>

      {/* ── COVER IMAGE ── */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
          Cover Image <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span>
        </label>

        {form.imagePreview ? (
          <div className="relative rounded-xl overflow-hidden">
            <img src={form.imagePreview} alt="Preview"
              className="w-full h-36 object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, image: null, imagePreview: null }))}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60
                         hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/50 text-white text-xs">
              {form.image?.name}
            </span>
          </div>
        ) : (
          <label className="border-2 border-dashed border-border/50 hover:border-primary/50
                             rounded-xl h-28 flex flex-col items-center justify-center gap-1.5
                             cursor-pointer transition-colors hover:bg-muted/20 group">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center
                            group-hover:bg-primary/20 transition-colors">
              <ImagePlus className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-medium">Click to upload image</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP - max 5MB</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0]
                if (!file) return
                if (file.size > 5 * 1024 * 1024) return
                const reader = new FileReader()
                reader.onload = (ev) =>
                  setForm((prev) => ({ ...prev, image: file, imagePreview: ev.target.result }))
                reader.readAsDataURL(file)
              }}
            />
          </label>
        )}
      </div>

      {/* ── CONTENT with VS Code style AI autocomplete ── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Content
          </label>
          {contentSuggestLoading && (
            <div className="flex items-center gap-1 text-xs text-violet-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>AI thinking...</span>
            </div>
          )}
        </div>

        <textarea
          ref={textareaRef}
          rows={6}
          className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm
                     outline-none focus:border-primary focus:bg-background transition-colors resize-none"
          placeholder="Start writing your blog content... (AI will suggest as you type)"
          value={form.content}
          onChange={handleContentChange}
          onKeyDown={handleContentKeyDown}
        />

        {/* VS Code style suggestion box */}
        {contentSuggestion && (
          <div className="mt-1.5 px-4 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/20
                          flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-violet-300/90 italic leading-relaxed">
                {contentSuggestion}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, content: prev.content + " " + contentSuggestion }))
                  setContentSuggestion("")
                }}
                className="text-xs px-2 py-1 rounded-lg bg-violet-500/20 text-violet-300
                           hover:bg-violet-500/30 transition-colors font-semibold whitespace-nowrap"
              >
                Tab ↹
              </button>
              <button
                type="button"
                onClick={() => setContentSuggestion("")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground/60 mt-1.5">
          💡 Press <kbd className="px-1 py-0.5 rounded bg-muted text-xs font-mono">Tab</kbd> to accept AI suggestion · <kbd className="px-1 py-0.5 rounded bg-muted text-xs font-mono">Esc</kbd> to dismiss
        </p>
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary
                   text-primary-foreground rounded-xl text-sm font-semibold
                   hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitting ? "Processing..." : submitLabel}
      </button>
    </div>
  )
}

export default function MyBlogs() {
  const { user } = useSelector((s) => s.auth)

  const [blogs,      setBlogs]      = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState(null)
  const [message,    setMessage]    = useState(null)
  const [search,     setSearch]     = useState("")

  const [showCreate, setShowCreate] = useState(false)
  const [showEdit,   setShowEdit]   = useState(false)
  const [showDelete, setShowDelete] = useState(null)

  const [form,   setForm]   = useState({ title: "", content: "", categoryId: "", image: null, imagePreview: null })
  const [editId, setEditId] = useState(null)
  const [page,   setPage]   = useState(0)
  const PAGE_SIZE = 6

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [allRes, catsRes] = await Promise.all([
        axiosInstance.get("/posts/all"),
        axiosInstance.get("/categories"),
      ])
      const all  = Array.isArray(allRes.data)  ? allRes.data  : []
      const cats = Array.isArray(catsRes.data) ? catsRes.data : []
      const mine = all.filter(
        (p) => p.authorName?.toLowerCase().trim() === user?.fullName?.toLowerCase().trim()
      )
      setBlogs(mine)
      setCategories(cats)
    } catch {
      setError("Failed to load data. Please check backend.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleCreate = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.categoryId) {
      showMsg("error", "Please fill all fields."); return
    }
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append(
        "post",
        new Blob([JSON.stringify({
          title:      form.title,
          content:    form.content,
          categoryID: Number(form.categoryId),
          authorID:   Number(user?.id),
        })], { type: "application/json" })
      )
      if (form.image) formData.append("image", form.image)

      await axiosInstance.post("/posts", formData)
      showMsg("success", "Blog created successfully! 🎉")
      setShowCreate(false)
      setForm({ title: "", content: "", categoryId: "", image: null, imagePreview: null })
      fetchData()
    } catch (err) {
      showMsg("error", err?.response?.data?.message || err?.response?.data?.error || "Blog creation failed: " + (err?.response?.status || "Network error"))
    } finally {
      setSubmitting(false)
    }
  }

  const openEdit = (blog) => {
    setEditId(blog.ID || blog.id)
    setForm({
      title:        blog.title      || "",
      content:      blog.content    || "",
      categoryId:   blog.categoryID || blog.categoryId || "",
      image:        null,
      imagePreview: null,
    })
    setShowEdit(true)
  }

  const handleEdit = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.categoryId) {
      showMsg("error", "Please fill all fields."); return
    }
    setSubmitting(true)
    try {
      await axiosInstance.put(`/posts/${editId}`, {
        title:      form.title,
        content:    form.content,
        categoryID: Number(form.categoryId),
        authorID:   Number(user?.id),
      })
      showMsg("success", "Blog updated successfully! 🎉")
      setShowEdit(false)
      setForm({ title: "", content: "", categoryId: "", image: null, imagePreview: null })
      fetchData()
    } catch {
      showMsg("error", "Blog update failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setSubmitting(true)
    try {
      await axiosInstance.delete(`/posts/${id}`)
      showMsg("success", "Blog deleted successfully!")
      setShowDelete(null)
      fetchData()
    } catch {
      showMsg("error", "Blog deletion failed.")
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = blogs.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"

  const Skel = () => (
    <div className="animate-pulse bg-muted/50 rounded-2xl h-40 w-full" />
  )

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <div className="flex-1 lg:ml-64 min-w-0 pt-14 lg:pt-0 flex flex-col">

        {/* HEADER */}
        <header className="h-16 border-b border-border/50 flex items-center justify-between
                           px-4 sm:px-6 lg:px-8 sticky top-0 z-40
                           bg-background/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">My Blogs</h1>
            {!loading && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary">
                {blogs.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground
                         hover:bg-muted/50 transition-colors disabled:opacity-50"
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <RefreshCw className="w-4 h-4" />
              }
            </button>
            <button
              onClick={() => {
                setForm({ title: "", content: "", categoryId: "", image: null, imagePreview: null })
                setShowCreate(true)
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary text-primary-foreground
                         rounded-xl text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Blog</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5">

            {/* Toast */}
            {message && (
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium border ${
                message.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                  : "bg-red-500/10 border-red-500/30 text-red-500"
              }`}>
                {message.type === "success"
                  ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  : <AlertCircle className="w-4 h-4 flex-shrink-0" />
                }
                {message.text}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30
                              text-red-500 rounded-xl px-4 py-3.5 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="w-full bg-muted/30 border border-border/50 rounded-xl pl-11 pr-4 py-2.5 text-sm
                           outline-none focus:border-primary focus:bg-background transition-colors"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Content */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => <Skel key={i} />)}
              </div>

            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="font-semibold text-base mb-1">
                    {search ? "No blogs found" : "No blogs yet"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {search ? `No results for "${search}"` : "Start writing your first blog!"}
                  </p>
                </div>
                {!search && (
                  <button
                    onClick={() => {
                      setForm({ title: "", content: "", categoryId: "", image: null, imagePreview: null })
                      setShowCreate(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground
                               rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <PlusCircle className="w-4 h-4" /> Write First Blog
                  </button>
                )}
              </div>

            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginated.map((blog) => (
                    <div
                      key={blog.ID || blog.id}
                      className="glass-card rounded-2xl overflow-hidden flex flex-col hover:shadow-lg smooth-transition group"
                    >
                      <div className="relative h-40 bg-muted flex-shrink-0">
                        {blog.imageUrl ? (
                          <img
                            src={
                              blog.imageUrl.startsWith("/uploads")
                                ? `${import.meta.env.VITE_API_BASE_URL || "https://bloghub-rrph.onrender.com"}${blog.imageUrl}`
                                : blog.imageUrl
                            }
                            alt={blog.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                            <FileText className="w-10 h-10 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                           text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            <FolderOpen className="w-3 h-3" />
                            {blog.categoryName || "Uncategorized"}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{fmtDate(blog.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {blog.title}
                          </h3>
                          {blog.content && (
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                              {blog.content}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <FileText className="w-3.5 h-3.5" />
                            <span>By {blog.authorName || user?.fullName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(blog)}
                              className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary
                                         text-muted-foreground transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setShowDelete(blog.ID || blog.id)}
                              className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500
                                         text-muted-foreground transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-3 pt-4">
                    <div className="border-t border-border/40 w-full" />
                    <nav className="flex items-center gap-1">
                      <button
                        onClick={() => { setPage((prev) => prev - 1); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                        disabled={page === 0}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border/50
                                   text-muted-foreground hover:bg-muted/50 hover:text-foreground
                                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                        <button
                          key={p}
                          onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                            page === p
                              ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                              : "border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          {p + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => { setPage((prev) => prev + 1); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                        disabled={page === totalPages - 1}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border/50
                                   text-muted-foreground hover:bg-muted/50 hover:text-foreground
                                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </nav>
                    <p className="text-xs text-muted-foreground">
                      Showing{" "}
                      <span className="font-semibold text-foreground">
                        {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)}
                      </span>
                      {" "}of{" "}
                      <span className="font-semibold text-foreground">{filtered.length}</span> blogs
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <Modal title="Write New Blog ✍️" onClose={() => setShowCreate(false)}>
          <BlogForm
            form={form}
            setForm={setForm}
            categories={categories}
            onSubmit={handleCreate}
            submitLabel="Create Blog"
            submitting={submitting}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <Modal title="Edit Blog ✏️" onClose={() => setShowEdit(false)}>
          <BlogForm
            form={form}
            setForm={setForm}
            categories={categories}
            onSubmit={handleEdit}
            submitLabel="Save Changes"
            submitting={submitting}
          />
        </Modal>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Delete Blog?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This action cannot be undone. Blog will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(null)}
                className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium
                           hover:bg-muted/40 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDelete)}
                disabled={submitting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold
                           hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}