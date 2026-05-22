import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from "react-redux"
import { verifyOtp } from "@/Features/auth/authThunk";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("")
  const [localError, setLocalError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { loading, error } = useSelector((state) => state.auth)

  const email = location.state?.email

  const handleVerify = async (e) => {
    e.preventDefault()
    setLocalError("")

    if (!otp) {
      setLocalError("Enter OTP")
      return
    }

    const res = await dispatch(
      verifyOtp({
        email,
        otp,
      })
    )

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/login")
    } else {
      setLocalError(res.payload || "Invalid OTP")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 border rounded-xl">

        <h1 className="text-2xl font-bold text-center mb-4">
          Verify OTP
        </h1>

        <p className="text-center text-sm mb-6">
          OTP sent to <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="text-center tracking-widest"
          />

          {localError && <p className="text-red-500">{localError}</p>}
          {error && <p className="text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>

      </div>
    </div>
  )
}

export default VerifyOtp
