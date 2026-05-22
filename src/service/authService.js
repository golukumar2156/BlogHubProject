import axiosInstance from "./axiosInstance"

export const registerUserApi = (data) =>
  axiosInstance.post("/auth/register", data)

export const verifyOtpApi = (data) =>
  axiosInstance.post("/auth/verify-otp", data)
// ✅ LOGIN API
export const loginUserApi = (data) =>
  axiosInstance.post("/auth/login", data)