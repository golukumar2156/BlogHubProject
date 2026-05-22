import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowRight,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  Shield,
  Users,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "@/Features/auth/authThunk"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState(null)

  const [localError, setLocalError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error, user } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")
    setSuccessMessage("")

    if (!role) {
      setLocalError("Please select role")
      return
    }

    if (!email || !password) {
      setLocalError("All fields required")
      return
    }

    const payload = {
      email,
      password,
    }

    const res = await dispatch(loginUser(payload))

    if (res.meta.requestStatus === "fulfilled") {
      setSuccessMessage("Login successful 🎉")

      // 🔥 SAVE TOKEN
      localStorage.setItem("token", res.payload?.token)

      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin")
        } else {
          navigate("/dashboard")
        }
      }, 1000)
    } else {
      const msg =
        res.payload?.message || "Invalid credentials ❌"
      setLocalError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="p-8 border rounded-xl shadow-lg">

          {/* ✅ BACK BUTTON ADDED */}
          <Button
            type="button"
            variant="outline"
            className="mb-4"
            onClick={() => navigate("/onboarding")}
          >
            Back
          </Button>

          <h1 className="text-2xl font-bold text-center mb-6">
            Login
          </h1>

          {/* ROLE */}
          <div className="mb-6">
            <p className="text-sm font-semibold mb-3">Select Role</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("ADMIN")}
                className={`p-4 border-2 rounded-lg ${
                  role === "ADMIN"
                    ? "border-primary bg-primary/10"
                    : "border-gray-300"
                }`}
              >
                <Shield className="mx-auto mb-2" />
                Admin
              </button>

              <button
                type="button"
                onClick={() => setRole("AUTHOR")}
                className={`p-4 border-2 rounded-lg ${
                  role === "AUTHOR"
                    ? "border-primary bg-primary/10"
                    : "border-gray-300"
                }`}
              >
                <Users className="mx-auto mb-2" />
                Author
              </button>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {localError && (
              <p className="text-red-500">{localError}</p>
            )}

            {error && (
              <p className="text-red-500">
                {typeof error === "object" ? error.message : error}
              </p>
            )}

            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

          </form>

          <p className="text-center mt-4">
            Don't have account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-primary cursor-pointer"
            >
              Register
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginPage
