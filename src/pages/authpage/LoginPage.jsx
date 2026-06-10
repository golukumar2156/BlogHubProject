import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "@/Features/auth/authThunk"
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
  CheckCircle, AlertCircle, BookOpen
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
    if (!email || !password) { setLocalErr("Email aur password dono required hain."); return }

    const res = await dispatch(loginUser({ email, password }))

    if (res.meta.requestStatus === "fulfilled") {
      const { token, user } = res.payload ?? {}
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setSuccess(true)
      setTimeout(() => {
        // role backend se aata hai — frontend role selection ki zaroorat nahi
        navigate(user?.role === "ADMIN" ? "/admin" : "/dashboard", { replace: true })
      }, 900)
    } else {
      setLocalErr(res.payload?.message || "Invalid credentials. Dobara try karo.")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">

      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

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
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Apne account mein login karo</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-7 sm:p-8 border border-border/50 shadow-xl">

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30
                            text-emerald-600 rounded-xl px-4 py-3 text-sm font-medium mb-5">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              Login successful! Redirect ho raha hai…
            </div>
          )}

          {/* Error */}
          {(localErr || error) && !success && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30
                            text-red-500 rounded-xl px-4 py-3 text-sm font-medium mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {localErr || (typeof error === "object" ? error?.message : error)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/50
                             bg-muted/30 outline-none focus:border-primary focus:bg-background transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Apna password daalo"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-border/50
                             bg-muted/30 outline-none focus:border-primary focus:bg-background transition-colors"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                         bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm
                         hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-violet-500/20 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-background text-xs text-muted-foreground">OR</span>
            </div>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground">
            Account nahi hai?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline underline-offset-4">
              Register karo
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center mt-5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors flex items-center justify-center gap-1">
            ← Home pe wapas jao
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage