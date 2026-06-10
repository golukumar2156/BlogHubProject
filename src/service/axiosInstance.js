import axios from "axios"

const BASE_URL = "http://localhost:7000/api"

// ── Authenticated instance (login required endpoints) ──
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Public instance (no token — for Discover/BlogsPage) ──
export const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

export default axiosInstance