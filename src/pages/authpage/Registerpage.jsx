import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "@/Features/auth/authThunk"
import {
  User, Mail, Lock, Eye, EyeOff, Phone, Info,
  ArrowRight, Loader2, CheckCircle, AlertCircle, BookOpen, Sparkles
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
      setLocalErr("Please fill in all required fields."); return
    }
    if (password.length < 6) {
      setLocalErr("Password must be at least 6 characters."); return
    }
    if (password !== confirmPassword) {
      setLocalErr("Passwords do not match."); return
    }
    const res = await dispatch(registerUser({
      fullName: form.fullName.trim(),
      email:    form.email.trim(),
      password: form.password,
      about:    form.about.trim(),
      phone:    form.phone.trim() || undefined,
      role:     "AUTHOR",
    }))
    if (res.meta.requestStatus === "fulfilled") {
      setSuccess(true)
      setTimeout(() => navigate("/verify-otp", { state: { email: form.email } }), 1000)
    } else {
      setLocalErr(res.payload?.message || res.payload?.error || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen w-full flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] relative flex-col items-center justify-center
                      bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 overflow-hidden p-12">
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-white/8 blur-3xl"/>
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full bg-white/8 blur-2xl"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"/>

        <div className="relative z-10 text-center max-w-xs">
          <div className="w-16 h-16 bg-white/15 border border-white/25 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <BookOpen className="w-8 h-8 text-white"/>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Start writing<br/>your story today.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-10">
            Your ideas deserve an audience. Publish to thousands of readers who are eager to learn and discover.
          </p>

          {/* feature list */}
          <div className="space-y-3 text-left">
            {[
              "Free to publish forever",
              "No ads — ever",
              "Rich text editor",
              "Built-in audience of 98K+ readers",
            ].map(f => (
              <div key={f} className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 text-white/80 flex-shrink-0"/>
                <span className="text-white/80 text-xs">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex-1 flex flex-col bg-background">

        {/* top bar */}
        <header className="w-full px-5 sm:px-8 py-4 flex items-center justify-between border-b border-border/30 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4 text-white"/>
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight">BlogHub</span>
          </Link>
          <Link to="/" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </header>

        {/* form area */}
        <div className="flex-1 flex items-start justify-center px-5 sm:px-8 py-8 sm:py-10 overflow-y-auto">

          <div className="fixed top-0 right-0 w-64 h-64 rounded-full bg-violet-500/5 blur-[80px] pointer-events-none -z-10 lg:hidden"/>
          <div className="fixed bottom-0 left-0 w-56 h-56 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none -z-10 lg:hidden"/>

          <div className="w-full max-w-sm sm:max-w-md">

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                              bg-violet-500/10 border border-violet-500/20 text-violet-500
                              text-xs font-semibold mb-4">
                <Sparkles className="w-3 h-3"/>
                It's free, always
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1.5">Create your account</h1>
              <p className="text-sm text-muted-foreground">Join thousands of writers and readers on BlogHub.</p>
            </div>

            {success && (
              <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/25
                              text-emerald-600 rounded-xl px-4 py-3 text-sm font-medium mb-5">
                <CheckCircle className="w-4 h-4 flex-shrink-0"/>
                Account created! Check your email for the OTP.
              </div>
            )}
            {(localErr || error) && !success && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25
                              text-red-500 rounded-xl px-4 py-3 text-sm font-medium mb-5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5"/>
                <span>{localErr || (typeof error === "object" ? error?.message : error)}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"/>
                  <input placeholder="Your full name" value={form.fullName} onChange={set("fullName")}
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border/50
                               bg-muted/20 outline-none focus:border-primary focus:bg-background
                               transition-colors placeholder:text-muted-foreground/50"/>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"/>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")}
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border/50
                               bg-muted/20 outline-none focus:border-primary focus:bg-background
                               transition-colors placeholder:text-muted-foreground/50"/>
                </div>
              </div>

              {/* Password row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"/>
                    <input type={showPwd ? "text" : "password"} placeholder="Min 6 chars"
                      value={form.password} onChange={set("password")} autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-border/50
                                 bg-muted/20 outline-none focus:border-primary focus:bg-background
                                 transition-colors placeholder:text-muted-foreground/50"/>
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPwd ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                    Confirm <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"/>
                    <input type={showConfirm ? "text" : "password"} placeholder="Repeat password"
                      value={form.confirmPassword} onChange={set("confirmPassword")} autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-border/50
                                 bg-muted/20 outline-none focus:border-primary focus:bg-background
                                 transition-colors placeholder:text-muted-foreground/50"/>
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  About <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Info className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none"/>
                  <textarea placeholder="Tell readers a bit about yourself…"
                    value={form.about} onChange={set("about")} rows={2}
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border/50
                               bg-muted/20 outline-none focus:border-primary focus:bg-background
                               transition-colors resize-none placeholder:text-muted-foreground/50"/>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Phone <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"/>
                  <input type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={set("phone")}
                    autoComplete="tel"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border/50
                               bg-muted/20 outline-none focus:border-primary focus:bg-background
                               transition-colors placeholder:text-muted-foreground/50"/>
                </div>
              </div>

              <button type="submit" disabled={loading || success}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl mt-1
                           bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm
                           hover:opacity-90 active:scale-[0.98] disabled:opacity-50
                           transition-all shadow-lg shadow-violet-500/20">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <ArrowRight className="w-4 h-4"/>}
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40"/>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-background text-xs text-muted-foreground tracking-wider">ALREADY A MEMBER?</span>
              </div>
            </div>

            <Link to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                         border border-border/60 text-sm font-semibold hover:bg-muted/40 transition-colors">
              Sign in to your account →
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage