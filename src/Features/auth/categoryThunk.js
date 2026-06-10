import { createAsyncThunk } from "@reduxjs/toolkit"
import {
  getAllCategoriesApi,
  getCategoryByIdApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../service/categoryService"
 
// ── GET ALL  ──────────────────────────────────────────────────
// Returns: [{ ID, catName, Description }, ...]
export const fetchAllCategories = createAsyncThunk(
  "category/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllCategoriesApi()
      return res.data          // List<CategoryResponseDTO>
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch categories" })
    }
  }
)
 
// ── GET BY ID  ────────────────────────────────────────────────
// Returns: { ID, catName, Description }
export const fetchCategoryById = createAsyncThunk(
  "category/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getCategoryByIdApi(id)
      return res.data          // CategoryResponseDTO
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Category not found" })
    }
  }
)
 
// ── CREATE (ADMIN only)  ──────────────────────────────────────
// Payload: { catName: string, Description: string }  ← capital D, @NotBlank
// Returns: { ID, catName, Description }
export const createCategory = createAsyncThunk(
  "category/create",
  async ({ catName, Description }, { rejectWithValue }) => {
    try {
      const res = await createCategoryApi({ catName, Description })
      return res.data          // CategoryResponseDTO
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to create category" })
    }
  }
)
 
// ── UPDATE (ADMIN only)  ──────────────────────────────────────
// Payload: { id, catName?, Description? }  ← at least one field required
// Returns: { ID, catName, Description }
export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, catName, Description }, { rejectWithValue }) => {
    try {
      const res = await updateCategoryApi(id, { catName, Description })
      return res.data          // CategoryResponseDTO
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to update category" })
    }
  }
)
 
// ── DELETE (ADMIN only)  ──────────────────────────────────────
// Payload: id (Long)
// Returns: "Category deleted successfully"
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategoryApi(id)
      return id                // store mein filter ke liye ID wapas karo
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to delete category" })
    }
  }
)
 