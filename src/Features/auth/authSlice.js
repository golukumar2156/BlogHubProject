import { createSlice } from "@reduxjs/toolkit"
import { registerUser, verifyOtp, loginUser } from "./authThunk"

const savedUser  = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null

const initialState = {
  loading: false,
  error: null,
  registerSuccess: false,
  otpSuccess: false,
  user:  savedUser,
  token: localStorage.getItem("token") || null,
  message: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    resetAuth: () => {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      return { ...initialState, user: null, token: null }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem("user", JSON.stringify(state.user))
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading         = false
        state.registerSuccess = true
        state.message         = action.payload?.message || "OTP Sent"
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload?.message || action.payload?.error || "Registration failed"
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload?.user  || null
        state.token   = action.payload?.token || null
        // save both token and user to localStorage
        if (action.payload?.token) {
          localStorage.setItem("token", action.payload.token)
          localStorage.setItem("user",  JSON.stringify(action.payload.user))
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload?.message || "Login failed ❌"
      })

      // VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading    = false
        state.otpSuccess = true
        state.user       = action.payload?.user || null
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload?.message || action.payload?.error || "Invalid OTP"
      })
  },
})

export const { resetAuth, updateUser } = authSlice.actions
export default authSlice.reducer