import axiosInstance, { publicAxios } from "./axiosInstance"

// ─────────────────────────────────────────────
//  Backend: /api/categories
//  CategoryCreateDTO   → { catName, Description }   (both @NotBlank — required)
//  CategoryUpdateDTO   → { catName?, Description? }  (at least one required)
//  CategoryResponseDTO → { ID, catName, Description } (capital ID & Description)
// ─────────────────────────────────────────────

// GET /api/categories  →  List<CategoryResponseDTO>  (public)
export const getAllCategoriesApi = () =>
  publicAxios.get("/categories")

// GET /api/categories/:id  →  CategoryResponseDTO  (public)
export const getCategoryByIdApi = (id) =>
  publicAxios.get(`/categories/${id}`)

// POST /api/categories  →  CategoryResponseDTO  (ADMIN only)
export const createCategoryApi = ({ catName, Description }) =>
  axiosInstance.post("/categories", { catName, Description })

// PUT /api/categories/:id  →  CategoryResponseDTO  (ADMIN only)
export const updateCategoryApi = (id, { catName, Description }) =>
  axiosInstance.put(`/categories/${id}`, { catName, Description })

// DELETE /api/categories/:id  →  "Category deleted successfully"  (ADMIN only)
export const deleteCategoryApi = (id) =>
  axiosInstance.delete(`/categories/${id}`)