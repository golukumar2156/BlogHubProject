import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Sidebar from "./Sidebar"
import axiosInstance from "@/service/axiosInstance"
import {
  Trash2, Edit2, Search, CheckCircle, AlertCircle,
  X, PlusCircle, BookOpen, FileText, Clock,
  Loader2, RefreshCw, FolderOpen, ImagePlus,
  ChevronLeft, ChevronRight,
} from "lucide-react"

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

  const handleCreate = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.categoryId) {
      showMsg("error", "Saare fields bharo."); return
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
      showMsg("success", "Blog successfully create hua! ")
      setShowCreate(false)
      setForm({ title: "", content: "", categoryId: "", image: null, imagePreview: null })
      fetchData()
    } catch (err) {
      showMsg("error", err?.response?.data?.message || err?.response?.data?.error || "Blog create nahi hua: " + (err?.response?.status || "Network error"))
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
      showMsg("error", "Saare fields bharo."); return
    }
    setSubmitting(true)
    try {
      await axiosInstance.put(`/posts/${editId}`, {
        title:      form.title,
        content:    form.content,
        categoryID: Number(form.categoryId),
        authorID:   Number(user?.id),
      })
      showMsg("success", "Blog update ho gaya! ")
      setShowEdit(false)
      setForm({ title: "", content: "", categoryId: "", image: null, imagePreview: null })
      fetchData()
    } catch {
      showMsg("error", "Blog update nahi hua. Dobara try karo.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setSubmitting(true)
    try {
      await axiosInstance.delete(`/posts/${id}`)
      showMsg("success", "Blog delete ho gaya! ")
      setShowDelete(null)
      fetchData()
    } catch {
      showMsg("error", "Blog delete nahi hua.")
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
                placeholder="Blog search karo..."
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
                    {search ? "Koi blog nahi mila" : "Abhi koi blog nahi hai"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {search ? `"${search}" se koi match nahi mila` : "Pehla blog likhna shuru karo!"}
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
                    <PlusCircle className="w-4 h-4" /> Pehla Blog Likho
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
                      {/* Cover Image */}
                      <div className="relative h-40 bg-muted flex-shrink-0">
                        {blog.imageUrl ? (
                          <img
                            src={
                              blog.imageUrl.startsWith("/uploads")
                                ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:7000"}${blog.imageUrl}`
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

                {/* Pagination */}
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
        <Modal title="Naya Blog Likho " onClose={() => setShowCreate(false)}>
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
        <Modal title="Blog Edit Karo " onClose={() => setShowEdit(false)}>
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