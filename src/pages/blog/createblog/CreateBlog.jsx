import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  PenLine, ArrowLeft, CheckCircle, AlertCircle,
  Loader2, FolderOpen, ImagePlus, X
} from "lucide-react"
import Sidebar from "../Sidebar"
import axiosInstance from "@/service/axiosInstance"

export default function CreateBlogPage() {
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)

  const [title,      setTitle]      = useState("")
  const [content,    setContent]    = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState([])
  const [image,      setImage]      = useState(null)      // File object
  const [preview,    setPreview]    = useState(null)      // base64 preview
  const [message,    setMessage]    = useState(null)
  const [submitting, setSubmitting] = useState(false)


  useEffect(() => {
    axiosInstance.get("/categories")
      .then((r) => setCategories(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
  }, [])

  const showMsg = (type, text) => {
    setMessage({ type, text })
    if (type === "error") setTimeout(() => setMessage(null), 4000)
  }

  // ── Handle image pick ──
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      showMsg("error", "Only image files are allowed (JPG, PNG, WEBP, GIF)."); return
    }
    if (file.size > 5 * 1024 * 1024) {
      showMsg("error", "Image must be under 5 MB."); return
    }
    setImage(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(null)
    setPreview(null)

  }

  // ── Publish ──
  const handlePublish = async () => {
    if (!title.trim() || !content.trim() || !categoryId) {
      showMsg("error", "Title, content and category are all required."); return
    }
    setSubmitting(true)
    try {
      // multipart/form-data — "post" JSON part + optional "image" file
      const formData = new FormData()
      formData.append(
        "post",
        new Blob([JSON.stringify({
          title:      title.trim(),
          content:    content.trim(),
          categoryID: Number(categoryId),
          authorID:   Number(user?.id),
        })], { type: "application/json" })
      )
      if (image) formData.append("image", image)

      await axiosInstance.post("/posts", formData)

      showMsg("success", "Blog published successfully! 🎉")
      setTimeout(() => navigate("/my-blogs"), 1200)
    } catch (err) {
      showMsg("error",
        err?.response?.data?.message ||
        err?.response?.data?.error   ||
        `Failed to publish blog (${err?.response?.status || "Network error"})`
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <div className="flex-1 lg:ml-64 min-w-0 pt-14 lg:pt-0 flex flex-col">

        {/* ── HEADER ── */}
        <header className="h-16 border-b border-border/50 flex items-center justify-between
                           px-4 sm:px-6 lg:px-8 sticky top-0 z-40
                           bg-background/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">Create New Blog</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm
                         border border-border/50 hover:bg-muted/40 transition-colors
                         text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <button onClick={handlePublish} disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                         bg-primary text-primary-foreground hover:opacity-90
                         disabled:opacity-50 transition-opacity">
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</>
                : <><PenLine className="w-4 h-4" /> Publish</>
              }
            </button>
          </div>
        </header>

        {/* ── BODY ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-5">

            {/* Message */}
            {message && (
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium border
                              ${message.type === "success"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                                : "bg-red-500/10 border-red-500/30 text-red-500"}`}>
                {message.type === "success"
                  ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                {message.text}
              </div>
            )}

            {/* Title */}
            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your blog title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-xl sm:text-2xl font-bold
                           text-foreground placeholder:text-muted-foreground/50
                           outline-none border-none"
              />
            </div>

            {/* Category */}
            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FolderOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-muted/30 border border-border/50 rounded-xl
                             pl-10 pr-4 py-2.5 text-sm text-foreground
                             outline-none focus:border-primary focus:bg-background
                             transition-colors appearance-none cursor-pointer">
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.ID} value={cat.ID}>{cat.catName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cover Image */}
            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
                Cover Image <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span>
              </label>

              {preview ? (
                /* Preview */
                <div className="relative rounded-xl overflow-hidden">
                  <img src={preview} alt="Preview"
                    className="w-full h-52 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60
                               hover:bg-black/80 flex items-center justify-center
                               text-white transition-colors backdrop-blur-sm">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg
                                  bg-black/50 text-white text-xs backdrop-blur-sm">
                    {image?.name}
                  </div>
                  {/* Change image button */}
                  <label className="absolute top-3 left-3 px-3 py-1.5 rounded-lg
                                    bg-black/60 hover:bg-black/80 text-white text-xs
                                    cursor-pointer transition-colors backdrop-blur-sm">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                /* Upload zone — label wrap kiya for reliable file picker */
                <label
                  className="border-2 border-dashed border-border/50 hover:border-primary/50
                             rounded-xl h-40 flex flex-col items-center justify-center gap-2
                             cursor-pointer transition-colors hover:bg-muted/20 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center
                                  group-hover:bg-primary/20 transition-colors">
                    <ImagePlus className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Click to upload cover image</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, GIF — max 5 MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Content */}
            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Write your blog content here…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className="w-full bg-transparent text-sm sm:text-base leading-relaxed
                           text-foreground placeholder:text-muted-foreground/50
                           outline-none border-none resize-none"
              />
            </div>

            {/* Bottom publish */}
            <button onClick={handlePublish} disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
                         text-sm font-semibold bg-primary text-primary-foreground
                         hover:opacity-90 disabled:opacity-50 transition-opacity">
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</>
                : <><PenLine className="w-4 h-4" /> Publish Blog</>
              }
            </button>

          </div>
        </main>
      </div>
    </div>
  )
}