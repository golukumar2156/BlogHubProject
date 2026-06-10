import { createSlice } from "@reduxjs/toolkit"
import {
  fetchAllCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categoryThunk"
 
// ─────────────────────────────────────────────
//  State shape mirrors CategoryResponseDTO:
//    category object = { ID, catName, Description }
//    (ID capital, Description capital — exactly as backend sends)
// ─────────────────────────────────────────────
 
const initialState = {
  categories: [],        // List<CategoryResponseDTO>
  selectedCategory: null, // single CategoryResponseDTO
  loading: false,
  error: null,
  successMessage: null,
}
 
const categorySlice = createSlice({
  name: "category",
  initialState,
 
  reducers: {
    clearCategoryMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null
    },
  },
 
  extraReducers: (builder) => {
    builder
 
      // ── FETCH ALL ────────────────────────────────────────────
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false
        // action.payload = [{ ID, catName, Description }, ...]
        state.categories = action.payload
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to fetch categories"
      })
 
      // ── FETCH BY ID ──────────────────────────────────────────
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false
        // action.payload = { ID, catName, Description }
        state.selectedCategory = action.payload
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Category not found"
      })
 
      // ── CREATE (ADMIN) ───────────────────────────────────────
      .addCase(createCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false
        // action.payload = { ID, catName, Description }
        state.categories = [...state.categories, action.payload]
        state.successMessage = "Category created successfully!"
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false
        // Backend throws: "Category name already exists" / "Only ADMIN can create"
        state.error = action.payload?.message || "Failed to create category"
      })
 
      // ── UPDATE (ADMIN) ───────────────────────────────────────
      .addCase(updateCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false
        // Backend returns updated CategoryResponseDTO — match by ID (capital)
        state.categories = state.categories.map((cat) =>
          cat.ID === action.payload.ID ? action.payload : cat
        )
        state.successMessage = "Category updated successfully!"
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false
        // Backend throws: "Category name already exists" / "At least one field must be provided"
        state.error = action.payload?.message || "Failed to update category"
      })
 
      // ── DELETE (ADMIN) ───────────────────────────────────────
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false
        // action.payload = id (the same id we passed)
        state.categories = state.categories.filter((cat) => cat.ID !== action.payload)
        state.successMessage = "Category deleted successfully!"
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || "Failed to delete category"
      })
  },
})
 
export const { clearCategoryMessages, clearSelectedCategory } = categorySlice.actions
export default categorySlice.reducer