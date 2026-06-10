import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "@/Features/auth/authThunk"
import {
  User, Mail, Lock, Eye, EyeOff, Phone, Info,
  ArrowRight, Loader2, CheckCircle, AlertCircle, BookOpen
} from "lucide-react"

const RegisterPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((s) => s.auth)

  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", about: "", phone: ""
  })
  const [showPwd,     setShowPwd]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [localErr,    setLocalErr]    = useState("")
  const [success,     setSuccess]     = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalErr("")

    const { fullName, email, password, confirmPassword, about } = form
    if (!fullName || !email || !password || !confirmPassword || !about) {
      setLocalErr("Sare required fields fill karo."); return
    }
    if (password.length < 6) {
      setLocalErr("Password kam se kam 6 characters ka hona chahiye."); return
    }
    if (password !== confirmPassword) {
      setLocalErr("Passwords match nahi kar rahe."); return
    }

    const res = await dispatch(registerUser({
      fullName: form.fullName.trim(),
      email:    form.email.trim(),
      password: form.password,
      about:    form.about.trim(),
      phone:    form.phone.trim() || undefined,
      role:     "AUTHOR",   // default — admin manually set hota hai
    }))

    if (res.meta.requestStatus === "fulfilled") {
      setSuccess(true)
      setTimeout(() => navigate("/verify-otp", { state: { email: form.email } }), 1000)
    } else {
      setLocalErr(
        res.payload?.message || res.payload?.error || "Registration failed. Dobara try karo."
      )
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">

      {/* Background blobs */}
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl
                            flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl">BlogHub</span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-7 sm:p-8 border border-border/50 shadow-xl">

          {success && (
            <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30
                            text-emerald-600 rounded-xl px-4 py-3 text-sm font-medium mb-5">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
               OTP sent! Please check your email.
            </div>
          )}

          {(localErr || error) && !success && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30
                            text-red-500 rounded-xl px-4 py-3 text-sm font-medium mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {localErr || (typeof error === "object" ? error?.message : error)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input placeholder="Enter your fullname" value={form.fullName} onChange={set("fullName")}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/50
                             bg-muted/30 outline-none focus:border-primary focus:bg-background transition-colors" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/50
                             bg-muted/30 outline-none focus:border-primary focus:bg-background transition-colors" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPwd ? "text" : "password"} placeholder="Enter your password"
                  value={form.password} onChange={set("password")}
                  className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-border/50
                             bg-muted/30 outline-none focus:border-primary focus:bg-background transition-colors" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showConfirm ? "text" : "password"} placeholder="Re-enter your password"
                  value={form.confirmPassword} onChange={set("confirmPassword")}
                  className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-border/50
                             bg-muted/30 outline-none focus:border-primary focus:bg-background transition-colors" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* About */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                About <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Info className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <textarea placeholder="Write something about yourself…" value={form.about} onChange={set("about")}
                  rows={2}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/50
                             bg-muted/30 outline-none focus:border-primary focus:bg-background transition-colors resize-none" />
              </div>
            </div>

            {/* Phone — optional */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Phone <span className="text-xs font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="tel" placeholder="Phone number" value={form.phone} onChange={set("phone")}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/50
                             bg-muted/30 outline-none focus:border-primary focus:bg-background transition-colors" />
              </div>
            </div>

            <button type="submit" disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl mt-2
                         bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm
                         hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-violet-500/20">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-background text-xs text-muted-foreground">OR</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Do you have Already account ?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">
             click to Login
            </Link>
          </p>
        </div>

        <p className="text-center mt-5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors flex items-center justify-center gap-1">
            ← Back To HomePage
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage