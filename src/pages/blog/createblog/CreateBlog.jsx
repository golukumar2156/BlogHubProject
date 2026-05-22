import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "../Sidebar" // ✅ FIXED

const DUMMY_CATEGORIES = [
  { id: "1", name: "Tutorial" },
  { id: "2", name: "CSS" },
  { id: "3", name: "Backend" },
  { id: "4", name: "TypeScript" },
  { id: "5", name: "API Design" },
]

export default function CreateBlogPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handlePublish = () => {
    if (!title || !content || !categoryId) {
      setMessage({ type: "error", text: "Please fill all required fields" })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setMessage({ type: "success", text: "Blog published (UI only)!" })
      setIsSubmitting(false)
      navigate("/my-blogs")
    }, 1200)
  }

  const handleSaveDraft = () => {
    setMessage({ type: "success", text: "Draft saved (UI only)" })
    setTimeout(() => setMessage(null), 2000)
  }

  return (
    <div className="flex bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="h-16 border-b flex items-center px-6 justify-between sticky top-0 bg-background">
          <h1 className="text-2xl font-bold">Create New Blog</h1>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>

            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>

            <Button onClick={handlePublish} disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-w-4xl">
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex gap-2 ${
                message.type === "success"
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <AlertCircle className="text-red-500" />
              )}
              <p>{message.text}</p>
            </div>
          )}

          <div className="space-y-6">
            <Input
              placeholder="Blog Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              placeholder="Excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />

            {/* Image */}
            <div className="border-dashed border rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    className="h-64 w-full object-cover rounded"
                  />
                  <button
                    className="absolute top-2 right-2 bg-black/60 p-2 rounded"
                    onClick={() => setImagePreview(null)}
                  >
                    <X className="text-white w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="mx-auto mb-2" />
                  Click to upload
                  <input type="file" hidden onChange={handleImageChange} />
                </label>
              )}
            </div>

            {/* Category */}
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Category *</option>
              {DUMMY_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Content */}
            <textarea
              className="w-full h-96 border rounded-lg p-4"
              placeholder="Start writing your blog..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
