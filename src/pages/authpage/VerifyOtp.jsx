import React, { useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { verifyOtp } from "@/Features/auth/authThunk"
import { Navbar } from "@/pages/Onbordingpage/Navbar"
import {
  ShieldCheck, Mail, AlertCircle, CheckCircle,
  ArrowRight, Loader2, RefreshCw,
} from "lucide-react"

const VerifyOtp = () => {
  // ── split 6-box OTP input ──
  const [digits,     setDigits]     = useState(Array(6).fill(""))
  const [localError, setLocalError] = useState("")
  const [success,    setSuccess]    = useState(false)
  const inputRefs = useRef([])

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error } = useSelector((s) => s.auth)

  const email = location.state?.email

  // ── handle digit change ──
  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return          // only digits
    const next = [...digits]
    next[i] = val.slice(-1)                 // max 1 char
    setDigits(next)
    setLocalError("")
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
  }

  // ── handle backspace ──
  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  // ── handle paste ──
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const next = [...digits]
    pasted.split("").forEach((c, i) => { next[i] = c })
    setDigits(next)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  // ── submit — same logic as before ──
  const handleVerify = async (e) => {
    e.preventDefault()
    setLocalError("")

    const otp = digits.join("")
    if (otp.length < 6) {
      setLocalError("Please enter the complete 6-digit OTP.")
      return
    }

    const res = await dispatch(verifyOtp({ email, otp }))

    if (res.meta.requestStatus === "fulfilled") {
      setSuccess(true)
      setTimeout(() => navigate("/login"), 1200)
    } else {
      setLocalError(res.payload || "Invalid OTP. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ambient blobs */}
      <div className="fixed -top-40 -right-40 w-[500px] h-[500px] rounded-full
                      bg-violet-500/8 blur-3xl pointer-events-none -z-0" />
      <div className="fixed -bottom-40 -left-40 w-[400px] h-[400px] rounded-full
                      bg-cyan-500/8 blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 flex items-center justify-center
                      min-h-[calc(100vh-4rem)] px-4 pt-16 pb-10">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="glass-card rounded-2xl p-7 sm:p-9 border border-border/50 shadow-2xl">

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600
                                flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                {/* pulse ring */}
                <span className="absolute inset-0 rounded-2xl bg-violet-500/20 animate-ping" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                Verify your email
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We sent a 6-digit code to
              </p>
              {email && (
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl
                                bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate max-w-[220px]">{email}</span>
                </div>
              )}
            </div>

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30
                              text-emerald-600 rounded-xl px-4 py-3 text-sm font-medium mb-5">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Email verified! Redirecting to login…
              </div>
            )}

            {/* Error */}
            {(localError || error) && !success && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30
                              text-red-500 rounded-xl px-4 py-3 text-sm font-medium mb-5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {localError || (typeof error === "object" ? error?.message : error)}
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerify}>

              {/* 6 digit boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6"
                   onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold
                               rounded-xl border-2 bg-muted/30 outline-none transition-all duration-200
                               ${d
                                 ? "border-primary bg-primary/5 text-primary"
                                 : "border-border/50 text-foreground"
                               }
                               focus:border-primary focus:bg-primary/5 focus:ring-0
                               disabled:opacity-50`}
                    disabled={loading || success}
                    style={{ height: "3.25rem" }}
                  />
                ))}
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 mb-6">
                {digits.map((d, i) => (
                  <span key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200
                      ${d ? "bg-primary w-3" : "bg-border"}`}
                  />
                ))}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading || success}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                           bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm
                           hover:opacity-90 disabled:opacity-50 transition-all
                           shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                  : success
                  ? <><CheckCircle className="w-4 h-4" /> Verified!</>
                  : <><ArrowRight className="w-4 h-4" /> Verify OTP</>
                }
              </button>
            </form>

            {/* Divider + back link */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-card text-xs text-muted-foreground">Didn't get the code?</span>
              </div>
            </div>

            <button type="button"
              onClick={() => navigate("/register")}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/50
                         text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Go back & resend OTP
            </button>

          </div>

          {/* bottom hint */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            Check your spam folder if you don't see the email.
          </p>

        </div>
      </div>
    </div>
  )
}

export default VerifyOtp