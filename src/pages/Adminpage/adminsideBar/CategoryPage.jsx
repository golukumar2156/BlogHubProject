import React from 'react'


import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Trash2, Edit2, Search, Plus, CheckCircle, AlertCircle, Loader } from "lucide-react"

import { AdminSidebar } from './AdminSidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const MOCK_CATEGORIES = [
  {
    id: "1",
    name: "Technology",
    slug: "technology",
    description: "Tech related blogs",
    color: "linear-gradient(135deg, #6366f1, #22c55e)",
  },
  {
    id: "2",
    name: "Photography",
    slug: "photography",
    description: "Camera and photos",
    color: "linear-gradient(135deg, #ec4899, #f59e0b)",
  },
]

export default function CategoryPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    // 🔐 frontend-only admin check (temporary)
    const user = { role: "admin" }
    if (user.role !== "admin") {
      navigate("/login")
      return
    }

    // mock load
    setTimeout(() => {
      setCategories(MOCK_CATEGORIES)
      setLoading(false)
    }, 800)
  }, [navigate])

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      setMessage({ type: "error", text: "Category name is required" })
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const created = {
        id: Date.now().toString(),
        name: newCategory.name,
        slug: newCategory.name.toLowerCase().replace(/\s+/g, "-"),
        description: newCategory.description,
        color: "linear-gradient(135deg, #6366f1, #ec4899)",
      }

      setCategories([created, ...categories])
      setNewCategory({ name: "", description: "" })
      setShowAddModal(false)
      setIsSubmitting(false)
      setMessage({ type: "success", text: "Category created successfully!" })

      setTimeout(() => setMessage(null), 3000)
    }, 700)
  }

  const handleDeleteCategory = (id) => {
    if (!window.confirm("Delete this category?")) return
    setCategories(categories.filter((c) => c.id !== id))
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex bg-background">
      <AdminSidebar/>

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="h-16 border-b flex items-center px-6 justify-between sticky top-0 bg-background">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </div>

        <div className="p-6">
          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded flex items-center gap-3 ${
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

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Grid */}
          {loading ? (
            <div className="p-12 text-center">
              <Loader className="animate-spin mx-auto mb-3" />
              Loading categories...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="glass-card p-6">
                  <div
                    className="h-24 rounded mb-4"
                    style={{ background: cat.color }}
                  />
                  <h3 className="font-bold">{cat.name}</h3>
                  <p className="text-sm text-muted">/{cat.slug}</p>

                  <div className="flex gap-2 mt-4">
                    <Button variant="ghost" size="sm" disabled>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="glass-card p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create Category</h2>

              <Input
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="mb-3"
              />

              <Input
                placeholder="Description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
              />

              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

