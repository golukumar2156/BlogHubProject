import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Trash2,
  Edit2,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader,
  FolderOpen,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getAllCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../../service/categoryService"

export default function CategoryPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  // ── Create Modal ──
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ catName: "", Description: "" })
  const [isCreating, setIsCreating] = useState(false)

  // ── Edit Modal ──
  const [showEditModal, setShowEditModal] = useState(false)
  const [editCategory, setEditCategory] = useState(null) // { ID, catName, Description }
  const [isUpdating, setIsUpdating] = useState(false)

  // ── Auth check ──
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }
    fetchCategories()
  }, [navigate])

  // ─────────────────────────────
  //  GET ALL CATEGORIES
  // ─────────────────────────────
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await getAllCategoriesApi()
      // Backend returns: List<CategoryResponseDTO> directly (no wrapper)
      const data = Array.isArray(res?.data) ? res.data : res?.data?.data || []
      setCategories(data)
    } catch (err) {
      showMsg("error", err?.response?.data?.message || "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  // ─────────────────────────────
  //  CREATE CATEGORY
  //  Body: { catName, Description } — both required (@NotBlank)
  // ─────────────────────────────
  const handleCreate = async () => {
    if (!newCategory.catName.trim()) {
      showMsg("error", "Category name is required"); return
    }
    if (!newCategory.Description.trim()) {
      showMsg("error", "Description is required"); return
    }
    try {
      setIsCreating(true)
      const res = await createCategoryApi({
        catName: newCategory.catName.trim(),
        Description: newCategory.Description.trim(),
      })
      // Backend returns: CategoryResponseDTO { ID, catName, Description }
      const created = res?.data
      setCategories((prev) => [created, ...prev])
      setNewCategory({ catName: "", Description: "" })
      setShowCreateModal(false)
      showMsg("success", "Category created successfully!")
    } catch (err) {
      showMsg("error", err?.response?.data?.message || "Failed to create category")
    } finally {
      setIsCreating(false)
    }
  }

  // ─────────────────────────────
  //  UPDATE CATEGORY
  //  Body: { catName?, Description? } — at least one
  // ─────────────────────────────
  const handleUpdate = async () => {
    if (!editCategory.catName.trim() && !editCategory.Description.trim()) {
      showMsg("error", "At least one field is required"); return
    }
    try {
      setIsUpdating(true)
      const res = await updateCategoryApi(editCategory.ID, {
        catName: editCategory.catName.trim(),
        Description: editCategory.Description.trim(),
      })
      const updated = res?.data
      setCategories((prev) =>
        prev.map((c) => (c.ID === updated.ID ? updated : c))
      )
      setShowEditModal(false)
      setEditCategory(null)
      showMsg("success", "Category updated successfully!")
    } catch (err) {
      showMsg("error", err?.response?.data?.message || "Failed to update category")
    } finally {
      setIsUpdating(false)
    }
  }

  // ─────────────────────────────
  //  DELETE CATEGORY
  // ─────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? This cannot be undone.")) return
    try {
      await deleteCategoryApi(id)
      setCategories((prev) => prev.filter((c) => c.ID !== id))
      showMsg("success", "Category deleted!")
    } catch (err) {
      showMsg("error", err?.response?.data?.message || "Failed to delete category")
    }
  }

  // ── Helper ──
  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3500)
  }

  // ── Search filter ──
  const filtered = categories.filter((cat) =>
    cat.catName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.Description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ─────────────────────────────
  //  UI
  // ─────────────────────────────
  return (
    <div className="flex-1 min-h-screen bg-background">
      {/* Header */}
      <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 md:px-8 sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
        <h1 className="text-xl font-bold tracking-tight">Categories</h1>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Category</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-500/15 text-green-600"
              : "bg-red-500/15 text-red-600"
          }`}>
            {message.type === "success"
              ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
              : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Stats */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Categories</p>
            <p className="text-2xl font-bold">{categories.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
            <Loader className="w-7 h-7 animate-spin" />
            <p className="text-sm">Loading categories...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
            <FolderOpen className="w-10 h-10 opacity-30" />
            <p className="text-sm">
              {searchQuery ? "No categories match your search" : "No categories found yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((cat) => (
              <div
                key={cat.ID}
                className="glass-card rounded-2xl p-5 flex flex-col gap-3 hover:shadow-lg smooth-transition group"
              >
                {/* Icon + Name */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary/60 to-accent/60 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-base truncate">{cat.catName}</h3>
                  </div>
                  {/* ID badge */}
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full flex-shrink-0">
                    #{cat.ID}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                  {cat.Description || "No description provided"}
                </p>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-border/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-1.5 text-xs"
                    onClick={() => {
                      setEditCategory({ ID: cat.ID, catName: cat.catName, Description: cat.Description || "" })
                      setShowEditModal(true)
                    }}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-1.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                    onClick={() => handleDelete(cat.ID)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Showing {filtered.length} of {categories.length} categories
          </p>
        )}
      </div>

      {/* ── CREATE MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Create Category</h2>
              <button
                onClick={() => { setShowCreateModal(false); setNewCategory({ catName: "", Description: "" }) }}
                className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Technology"
                  value={newCategory.catName}
                  onChange={(e) => setNewCategory((p) => ({ ...p, catName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Description <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="Brief description of this category"
                  value={newCategory.Description}
                  onChange={(e) => setNewCategory((p) => ({ ...p, Description: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowCreateModal(false); setNewCategory({ catName: "", Description: "" }) }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreate}
                disabled={isCreating}
              >
                {isCreating ? (
                  <><Loader className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                ) : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {showEditModal && editCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Edit Category</h2>
              <button
                onClick={() => { setShowEditModal(false); setEditCategory(null) }}
                className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Category Name
                </label>
                <Input
                  placeholder="e.g. Technology"
                  value={editCategory.catName}
                  onChange={(e) => setEditCategory((p) => ({ ...p, catName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Description
                </label>
                <Input
                  placeholder="Brief description"
                  value={editCategory.Description}
                  onChange={(e) => setEditCategory((p) => ({ ...p, Description: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowEditModal(false); setEditCategory(null) }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <><Loader className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}