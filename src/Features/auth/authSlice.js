import { createSlice } from "@reduxjs/toolkit"
import { registerUser, verifyOtp, loginUser } from "./authThunk"

const initialState = {
  loading: false,
  error: null,
  registerSuccess: false,
  otpSuccess: false,
  user: null,
  message: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    resetAuth: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.registerSuccess = true
        state.message = action.payload?.message || "OTP Sent"
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Registration failed"
      })
        // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload?.user
        state.token = action.payload?.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.payload?.message || "Login failed ❌"
      })
      // VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false
        state.otpSuccess = true
        state.user = action.payload?.user || null
      })

      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Invalid OTP"
      })
  },
})

export const { resetAuth } = authSlice.actions
export default authSlice.reducer
