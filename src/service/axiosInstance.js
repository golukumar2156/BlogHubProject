import axios from "axios"

// ── Authenticated instance (with JWT) ──
const axiosInstance = axios.create({
  baseURL: "http://localhost:7000/api",
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // ── KEY FIX: let browser set Content-Type for FormData ──
    // If body is FormData, delete any default Content-Type
    // so axios/browser auto-sets multipart/form-data with correct boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json"
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Public instance (no JWT — for blogs, categories) ──
export const publicAxios = axios.create({
  baseURL: "http://localhost:7000/api",
  headers: { "Content-Type": "application/json" },
})

export default axiosInstance