import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "@/Features/auth/authThunk"
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
  CheckCircle, AlertCircle, BookOpen, Sparkles
} from "lucide-react"

const LoginPage = () => {
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [showPwd,  setShowPwd]  = useState(false)
  const [localErr, setLocalErr] = useState("")
  const [success,  setSuccess]  = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalErr("")
    if (!email || !password) { setLocalErr("Email and password are required."); return }
    const res = await dispatch(loginUser({ email, password }))
    if (res.meta.requestStatus === "fulfilled") {
      const { token, user } = res.payload ?? {}
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setSuccess(true)
      setTimeout(() => {
        navigate(user?.role === "ADMIN" ? "/admin" : "/dashboard", { replace: true })
      }, 900)
    } else {
      setLocalErr(res.payload?.message || "Invalid credentials. Please try again.")
    }
  }

  return (
    <div className="min-h-screen w-full flex">

      {/* ── LEFT PANEL — decorative (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] relative flex-col items-center justify-center
                      bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 overflow-hidden p-12">
        {/* blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-white/8 blur-3xl"/>
        <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full bg-white/8 blur-2xl"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-fuchsia-500/15 blur-3xl"/>

        <div className="relative z-10 text-center max-w-xs">
          {/* logo */}
          <div className="w-16 h-16 bg-white/15 border border-white/25 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <BookOpen className="w-8 h-8 text-white"/>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Your stories<br/>live here.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-10">
            Join thousands of writers sharing ideas, insights, and inspiration every day.
          </p>

          {/* social proof */}
          <div className="space-y-3">
            {[
              { val: "12K+", label: "Articles published" },
              { val: "4.8K", label: "Active writers"     },
              { val: "98K+", label: "Monthly readers"    },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between
                                            bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <span className="text-white/70 text-xs">{s.label}</span>
                <span className="text-white font-bold text-sm">{s.val}</span>
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
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg
                            flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4 text-white"/>
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight">BlogHub</span>
          </Link>
          <Link to="/" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </header>

        {/* form area */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">

          {/* bg blobs — visible on mobile */}
          <div className="fixed top-0 right-0 w-64 h-64 rounded-full bg-violet-500/5 blur-[80px] pointer-events-none -z-10 lg:hidden"/>
          <div className="fixed bottom-0 left-0 w-56 h-56 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none -z-10 lg:hidden"/>

          <div className="w-full max-w-sm sm:max-w-md">

            <div className="mb-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                              bg-violet-500/10 border border-violet-500/20 text-violet-500
                              text-xs font-semibold mb-4">
                <Sparkles className="w-3 h-3"/>
                Welcome back
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1.5">Sign in to your account</h1>
              <p className="text-sm text-muted-foreground">Good to see you again. Enter your details below.</p>
            </div>

            {/* alerts */}
            {success && (
              <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/25
                              text-emerald-600 rounded-xl px-4 py-3 text-sm font-medium mb-5">
                <CheckCircle className="w-4 h-4 flex-shrink-0"/>
                Login successful! Redirecting…
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

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"/>
                  <input
                    type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-border/50
                               bg-muted/20 outline-none focus:border-primary focus:bg-background
                               transition-colors placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"/>
                  <input
                    type={showPwd ? "text" : "password"} placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 text-sm rounded-xl border border-border/50
                               bg-muted/20 outline-none focus:border-primary focus:bg-background
                               transition-colors placeholder:text-muted-foreground/50"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5">
                    {showPwd ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading || success}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl mt-2
                           bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm
                           hover:opacity-90 active:scale-[0.98] disabled:opacity-50
                           transition-all shadow-lg shadow-violet-500/20">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <ArrowRight className="w-4 h-4"/>}
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40"/>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-background text-xs text-muted-foreground tracking-wider">NEW TO BLOGHUB?</span>
              </div>
            </div>

            <Link to="/register"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                         border border-border/60 text-sm font-semibold
                         hover:bg-muted/40 transition-colors">
              Create a free account →
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage