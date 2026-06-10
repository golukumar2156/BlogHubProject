import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Sidebar from "./Sidebar"
import axiosInstance from "@/service/axiosInstance"
import {
  Trash2, Edit2, Search, CheckCircle, AlertCircle,
  X, PlusCircle, BookOpen, FileText, Clock,
  Loader2, RefreshCw, FolderOpen,
} from "lucide-react"

// ✅ Modal — MyBlogs ke BAHAR define kiya
const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-background border border-border/50 rounded-2xl shadow-2xl w-full max-w-lg">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <h2 className="text-base font-bold">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
)

// ✅ BlogForm — MyBlogs ke BAHAR define kiya
//    form aur setForm props ke zariye pass ho rahe hain
//    isliye har keystroke pe re-mount NAHI hoga
const BlogForm = ({ form, setForm, categories, onSubmit, submitLabel, submitting }) => (
  <div className="space-y-4">
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
        Title
      </label>
      <input
        className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm
                   outline-none focus:border-primary focus:bg-background transition-colors"
        placeholder="Blog ka title likhein..."
        value={form.title}
        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
      />
    </div>

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
        <option value="">Category select karo</option>
        {categories.map((cat) => (
          <option key={cat.ID} value={cat.ID}>{cat.catName}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
        Content
      </label>
      <textarea
        rows={5}
        className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm
                   outline-none focus:border-primary focus:bg-background transition-colors resize-none"
        placeholder="Blog ka content likhein..."
        value={form.content}
        onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
      />
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

// ─────────────────────────────────────────────
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

  const [form,   setForm]   = useState({ title: "", content: "", categoryId: "" })
  const [editId, setEditId] = useState(null)

  // ── Fetch ──
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
    } catch (err) {
      setError("Data load nahi hua. Backend check karo.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  // ── Create ──
  const handleCreate = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.categoryId) {
      showMsg("error", "Saare fields bharo."); return
    }
    setSubmitting(true)
    try {
      await axiosInstance.post("/posts", {
        title:      form.title,
        content:    form.content,
        categoryID: Number(form.categoryId),   // ✅ capital ID
        authorID:   Number(user?.id),           // ✅ required by backend
      })
      showMsg("success", "Blog successfully create hua! ✅")
      setShowCreate(false)
      setForm({ title: "", content: "", categoryId: "" })
      fetchData()
    } catch (err) {
      showMsg("error", err?.response?.data?.message || err?.response?.data?.error || "Blog create nahi hua: " + (err?.response?.status || "Network error"))
    } finally {
      setSubmitting(false)
    }
  }

  // ── Edit ──
  const openEdit = (blog) => {
    setEditId(blog.ID || blog.id)
    setForm({
      title:      blog.title      || "",
      content:    blog.content    || "",
      categoryId: blog.categoryId || "",
    })
    setShowEdit(true)
  }

  const handleEdit = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.categoryId) {
      showMsg("error", "Saare fields bharo."); return
    }
    setSubmitting(true)
    try {
      await axiosInstance.put(`/posts/${editId}`, {
        title:      form.title,
        content:    form.content,
        categoryID: Number(form.categoryId),   // ✅ capital ID
        authorID:   Number(user?.id),           // ✅ required by backend
      })
      showMsg("success", "Blog update ho gaya! ✅")
      setShowEdit(false)
      setForm({ title: "", content: "", categoryId: "" })
      fetchData()
    } catch (err) {
      showMsg("error", "Blog update nahi hua. Dobara try karo.")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Delete ──
  const handleDelete = async (id) => {
    setSubmitting(true)
    try {
      await axiosInstance.delete(`/posts/${id}`)
      showMsg("success", "Blog delete ho gaya! 🗑️")
      setShowDelete(null)
      fetchData()
    } catch (err) {
      showMsg("error", "Blog delete nahi hua.")
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = blogs.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  )

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"

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
              onClick={() => { setForm({ title: "", content: "", categoryId: "" }); setShowCreate(true) }}
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
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium
                              border ${message.type === "success"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                                : "bg-red-500/10 border-red-500/30 text-red-500"}`}>
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
                placeholder="Blog search karo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                {[1,2,3].map(i => <Skel key={i} />)}
              </div>

            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="font-semibold text-base mb-1">
                    {search ? "Koi blog nahi mila" : "Abhi koi blog nahi hai"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {search ? `"${search}" se koi match nahi mila` : "Pehla blog likhna shuru karo!"}
                  </p>
                </div>
                {!search && (
                  <button
                    onClick={() => { setForm({ title: "", content: "", categoryId: "" }); setShowCreate(true) }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground
                               rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <PlusCircle className="w-4 h-4" /> Pehla Blog Likho
                  </button>
                )}
              </div>

            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((blog) => (
                  <div key={blog.ID || blog.id}
                       className="glass-card rounded-2xl p-5 flex flex-col gap-3
                                  hover:shadow-lg smooth-transition group">
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
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <Modal title="Naya Blog Likho ✍️" onClose={() => setShowCreate(false)}>
          <BlogForm
            form={form}
            setForm={setForm}
            categories={categories}
            onSubmit={handleCreate}
            submitLabel="Blog Create Karo"
            submitting={submitting}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <Modal title="Blog Edit Karo ✏️" onClose={() => setShowEdit(false)}>
          <BlogForm
            form={form}
            setForm={setForm}
            categories={categories}
            onSubmit={handleEdit}
            submitLabel="Changes Save Karo"
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
            <h3 className="text-lg font-bold mb-2">Blog Delete Karo?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Yeh action undo nahi ho sakta. Blog permanently delete ho jaayega.
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