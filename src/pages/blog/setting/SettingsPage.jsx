import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Sidebar from "../Sidebar"
import axiosInstance from "@/service/axiosInstance"
import { loginUser } from "@/Features/auth/authThunk"
import { resetAuth, updateUser } from "@/Features/auth/authSlice"
import {
  User, Bell, Lock, LogOut, CheckCircle, AlertCircle,
  Eye, EyeOff, Loader2, ShieldCheck, Mail, Save, Phone, Info,
} from "lucide-react"

export default function SettingsPage() {
  const { user }   = useSelector((s) => s.auth)
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const [tab, setTab] = useState("profile")

  // ── Profile form ──
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email:    user?.email    || "",
    about:    user?.about    || "",
    phone:    user?.phone    || "",
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg,     setProfileMsg]     = useState(null)

  // ── Password form ──
  const [passwords, setPasswords] = useState({
    current: "", newPass: "", confirm: "",
  })
  const [showPwd, setShowPwd]       = useState({ current: false, newPass: false, confirm: false })
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg,     setPwdMsg]     = useState(null)

  const showTempMsg = (setter, type, text) => {
    setter({ type, text })
    setTimeout(() => setter(null), 4000)
  }

  // ── Profile Save ──
  const handleProfileSave = async () => {
    if (!profile.fullName.trim()) {
      showTempMsg(setProfileMsg, "error", "Name is required.")
      return
    }
    if (!profile.email.trim()) {
      showTempMsg(setProfileMsg, "error", "Email is required.")
      return
    }
    if (!profile.about.trim()) {
      showTempMsg(setProfileMsg, "error", "About field is required (min 1 character).")
      return
    }
    if (!user?.id) {
      showTempMsg(setProfileMsg, "error", "User ID not found. Please logout and login again.")
      return
    }

    setProfileLoading(true)
    try {
      const res = await axiosInstance.put(`/authors/${user.id}`, {
        fullName: profile.fullName.trim(),
        email:    profile.email.trim(),
        about:    profile.about.trim(),
        phone:    profile.phone.trim() || undefined,
      })

      // Update localStorage + Redux store
      const updatedUser = { ...user, ...res.data }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      dispatch(updateUser(res.data))

      showTempMsg(setProfileMsg, "success", "Profile updated successfully! ✅")
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.response?.data
        || "Profile update failed. Please try again."
      showTempMsg(setProfileMsg, "error", typeof msg === "string" ? msg : "Profile update failed.")
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Password — endpoint not available in backend ──
  const handlePasswordSave = async () => {
    showTempMsg(setPwdMsg, "error", "Password change is not yet implemented in the backend. You need to add the /authors/change-password endpoint in the backend.")
  }

  const handleLogout = () => {
    dispatch(resetAuth())
    navigate("/login", { replace: true })
  }

  // ── UI helpers ──
  const tabs = [
    { id: "profile",  label: "Profile",  icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "account",  label: "Account",  icon: Bell },
  ]

  const MsgBox = ({ msg }) => msg ? (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium border
                    ${msg.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                      : "bg-red-500/10 border-red-500/30 text-red-500"}`}>
      {msg.type === "success"
        ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
        : <AlertCircle className="w-4 h-4 flex-shrink-0" />
      }
      <span>{msg.text}</span>
    </div>
  ) : null

  const PwdInput = ({ field, placeholder }) => (
    <div className="relative">
      <input
        type={showPwd[field] ? "text" : "password"}
        placeholder={placeholder}
        value={passwords[field]}
        onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
        className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm pr-11
                   outline-none focus:border-primary focus:bg-background transition-colors"
      />
      <button
        type="button"
        onClick={() => setShowPwd({ ...showPwd, [field]: !showPwd[field] })}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {showPwd[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />

      <div className="flex-1 lg:ml-64 min-w-0 pt-14 lg:pt-0 flex flex-col">

        {/* HEADER */}
        <header className="h-16 border-b border-border/50 flex items-center justify-between
                           px-4 sm:px-6 lg:px-8 sticky top-0 z-40
                           bg-background/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">Settings</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-5">

            {/* ── TAB BAR ── */}
            <div className="flex gap-1 bg-muted/30 border border-border/40 rounded-2xl p-1">
              {tabs.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl
                                text-xs sm:text-sm font-medium transition-all
                                ${tab === t.id
                                  ? "bg-background text-foreground shadow-sm border border-border/40"
                                  : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </div>

            {/* ── PROFILE TAB ── */}
            {tab === "profile" && (
              <div className="space-y-4">

                {/* Avatar card */}
                <div className="glass-card rounded-2xl p-5 sm:p-6 flex items-center gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br
                                  from-violet-500 to-indigo-600 flex items-center justify-center
                                  shadow-lg ring-4 ring-violet-500/20 flex-shrink-0">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-lg truncate">{user?.fullName || "Author"}</p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full
                                     text-xs font-semibold bg-primary/15 text-primary">
                      <ShieldCheck className="w-3 h-3" />
                      {user?.role || "AUTHOR"}
                    </span>
                  </div>
                </div>

                {/* Edit form */}
                <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Personal Information
                  </h3>

                  <MsgBox msg={profileMsg} />

                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full bg-muted/30 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm
                                   outline-none focus:border-primary focus:bg-background transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-muted/30 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm
                                   outline-none focus:border-primary focus:bg-background transition-colors"
                        placeholder="Email address"
                      />
                    </div>
                  </div>

                  {/* About */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                      About <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Info className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                      <textarea
                        value={profile.about}
                        onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                        rows={3}
                        className="w-full bg-muted/30 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm
                                   outline-none focus:border-primary focus:bg-background transition-colors resize-none"
                        placeholder="Write something about yourself..."
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                      Phone <span className="text-xs text-muted-foreground normal-case font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-muted/30 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm
                                   outline-none focus:border-primary focus:bg-background transition-colors"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleProfileSave}
                    disabled={profileLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground
                               rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {profileLoading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Save className="w-4 h-4" />
                    }
                    {profileLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ── SECURITY TAB ── */}
            {tab === "security" && (
              <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Change Password
                </h3>

                {/* Info banner — backend endpoint missing */}
                <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30
                                text-amber-600 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Backend endpoint missing</p>
                    <p className="text-xs mt-0.5 text-amber-500/80">
                      To change password, the backend needs a{" "}
                      <code className="font-mono bg-amber-500/10 px-1 rounded">PUT /api/authors/change-password</code>{" "}
                      endpoint that accepts <code className="font-mono bg-amber-500/10 px-1 rounded">currentPassword</code> and{" "}
                      <code className="font-mono bg-amber-500/10 px-1 rounded">newPassword</code>.
                    </p>
                  </div>
                </div>

                <MsgBox msg={pwdMsg} />

                <div className="space-y-3 opacity-60 pointer-events-none select-none">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                      Current Password
                    </label>
                    <PwdInput field="current" placeholder="Current password" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                      New Password
                    </label>
                    <PwdInput field="newPass" placeholder="New password (min 6 chars)" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                      Confirm New Password
                    </label>
                    <PwdInput field="confirm" placeholder="Confirm password" />
                  </div>
                </div>

                <button
                  onClick={handlePasswordSave}
                  disabled
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground
                             rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  Update Password (Backend pending)
                </button>
              </div>
            )}

            {/* ── ACCOUNT TAB ── */}
            {tab === "account" && (
              <div className="space-y-4">

                {/* Account info */}
                <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-3">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Account Details
                  </h3>
                  {[
                    { label: "Full Name",  value: user?.fullName },
                    { label: "Email",      value: user?.email    },
                    { label: "Phone",      value: user?.phone    },
                    { label: "About",      value: user?.about    },
                    { label: "Role",       value: user?.role     },
                    { label: "User ID",    value: user?.id       },
                    { label: "Verified",   value: user?.emailVerified ? "Yes ✅" : "No ❌" },
                  ].map((item) => (
                    <div key={item.label}
                         className="flex items-start justify-between py-3 border-b border-border/30 last:border-0 gap-4">
                      <span className="text-sm text-muted-foreground flex-shrink-0">{item.label}</span>
                      <span className="text-sm font-semibold text-right break-all">{item.value || "—"}</span>
                    </div>
                  ))}
                </div>

                {/* Logout */}
                <div className="glass-card rounded-2xl p-5 sm:p-6">
                  <h3 className="text-base font-bold mb-1">Logout</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Apna session end karo aur home page pe jao.
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white
                               rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>

              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}