import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bloghubproject.onrender.com/api"

// ── Authenticated instance (with JWT) ──
const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
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
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

export default axiosInstance