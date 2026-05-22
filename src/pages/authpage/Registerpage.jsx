import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "@/Features/auth/authThunk"

const RegisterPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading, error } = useSelector((state) => state.auth)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [about, setAbout] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState(null)

  const [localError, setLocalError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")
    setSuccessMessage("")

    if (!role) {
      setLocalError("Please select role")
      return
    }

    if (!fullName || !email || !password || !confirmPassword || !about) {
      setLocalError("All required fields must be filled")
      return
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match")
      return
    }

    // ✅ FINAL PAYLOAD (FIXED)
    const payload = {
      fullName,
      email,
      password,
      role,   // 🔥 FIXED (no toUpperCase)
      about,
      phone,
    }

    console.log("PAYLOAD 👉", payload) // debug

    const res = await dispatch(registerUser(payload))

    if (res.meta.requestStatus === "fulfilled") {
      setSuccessMessage("OTP sent to your email 📩")

      setTimeout(() => {
        navigate("/verify-otp", { state: { email } })
      }, 1000)
    } else {
      const msg =
        res.payload?.message ||
        res.payload?.error ||
        "Registration failed"

      setLocalError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="p-8 border rounded-xl shadow-lg">

          <h1 className="text-2xl font-bold text-center mb-6">
            Create Account
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
                Author
              </button>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
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

            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Input
              placeholder="About"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            <Input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* ERRORS */}
            {localError && (
              <p className="text-red-500 text-sm">{localError}</p>
            )}

            {error && (
              <p className="text-red-500 text-sm">
                {typeof error === "object" ? error.message : error}
              </p>
            )}

            {successMessage && (
              <p className="text-green-500 text-sm">{successMessage}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-primary cursor-pointer"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}

export default RegisterPage
