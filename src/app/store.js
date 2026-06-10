import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../Features/auth/authSlice"
import categoryReducer from "@/Features/auth/categorySlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
  },
})
