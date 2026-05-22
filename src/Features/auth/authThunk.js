import { createAsyncThunk } from "@reduxjs/toolkit"
import { registerUserApi, verifyOtpApi } from "../../service/authService" 
// 🔥 services (NOT service)
import { loginUserApi } from "../../service/authService" // ✅ LOGIN API
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data)
      return res.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Something went wrong" }
      )
    }
  }
)

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await verifyOtpApi(data)
      return res.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Invalid OTP" }
      )
    }
  }
)

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)