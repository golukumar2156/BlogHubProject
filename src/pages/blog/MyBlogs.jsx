import { useState } from "react"
import Sidebar from "./Sidebar"
import {
  Trash2,
  Edit2,
  Eye,
  Search,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react"

// ✅ FIX: categories define karo
const categories = [
  { id: "1", name: "Tech" },
  { id: "2", name: "Design" },
  { id: "3", name: "Programming" },
]

export default function MyBlogs() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "React Basics",
      content: "Learn React step by step...",
      createdAt: "2025-01-10",
      author: { name: "Golu" },
      category: { id: "1", name: "Tech" },
      views: 120,
      status: "published",
    },
  ])

  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    categoryId: "",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState(null)

  // ✅ DELETE
  const handleDeleteBlog = (id) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id))
    setMessage({ type: "success", text: "Blog deleted!" })
    setTimeout(() => setMessage(null), 2000)
  }

  // ✅ CREATE BLOG (FIXED)
  const handleCreateBlog = () => {
    if (!newBlog.title || !newBlog.content || !newBlog.categoryId) {
      setMessage({ type: "error", text: "All fields required!" })
      return
    }

    const selectedCategory =
      categories.find((cat) => cat.id === newBlog.categoryId) ||
      { id: "", name: "Unknown" }

    const blog = {
      id: Date.now(),
      title: newBlog.title,
      content: newBlog.content,
      createdAt: new Date().toISOString(),
      author: { name: "Golu" },
      category: selectedCategory,
      views: 0,
      status: "published",
    }

    setBlogs((prev) => [blog, ...prev])

    setShowCreateModal(false)
    setNewBlog({ title: "", content: "", categoryId: "" })

    setMessage({ type: "success", text: "Blog Created!" })
    setTimeout(() => setMessage(null), 2000)
  }

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex bg-background">
      {/* ✅ Sidebar always visible */}
      <Sidebar />

      <div className="flex-1 lg:ml-64 relative">
        {/* 🔥 BLUR */}
        <div
          className={`${
            showCreateModal ? "blur-sm pointer-events-none" : ""
          } p-6`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Blogs</h1>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowCreateModal(true)}
            >
              Create Blog
            </button>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 p-3 rounded flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle />
              ) : (
                <AlertCircle />
              )}
              {message.text}
            </div>
          )}

          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <input
                className="pl-8 border p-2 w-full rounded"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="border rounded overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Views</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center">
                      No blogs found
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="border-b">
                      <td className="p-3">{blog.title}</td>
                      <td className="p-3">{blog.category?.name}</td>
                      <td className="p-3 flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {blog.views}
                      </td>
                      <td className="p-3">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <button className="mr-2">
                          <Edit2 />
                        </button>
                        <button onClick={() => handleDeleteBlog(blog.id)}>
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🔥 MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
              {/* Close */}
              <button
                className="absolute top-3 right-3"
                onClick={() => setShowCreateModal(false)}
              >
                <X />
              </button>

              <h2 className="text-xl font-bold mb-4">Create Blog</h2>

              {/* Title */}
              <input
                placeholder="Title"
                className="w-full border p-2 mb-3 rounded"
                value={newBlog.title}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, title: e.target.value })
                }
              />

              {/* Content */}
              <textarea
                placeholder="Content"
                className="w-full border p-2 mb-3 rounded"
                value={newBlog.content}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, content: e.target.value })
                }
              />

              {/* Category */}
              <select
                className="w-full border p-2 mb-3 rounded"
                value={newBlog.categoryId}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, categoryId: e.target.value })
                }
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Button */}
              <button
                className="w-full bg-blue-600 text-white py-2 rounded"
                onClick={handleCreateBlog}
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
