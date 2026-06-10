import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search, Trash2, UserCheck, UserX, Users,
  ShieldCheck, Clock, Loader, AlertCircle,
  Mail, Phone, ShieldOff, CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axiosInstance from "../../../service/axiosInstance"

export default function UsersPage() {
  const navigate = useNavigate()

  const [users,       setUsers]       = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus,setFilterStatus]= useState("all")
  const [loading,     setLoading]     = useState(true)
  const [toggling,    setToggling]    = useState(null) // id of user being toggled
  const [message,     setMessage]     = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }
    fetchUsers()
  }, [navigate])

  // ── GET ALL ──
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get("/authors")
      const data = res?.data?.data || res?.data || []
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      showMsg("error", err?.response?.data?.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (user) => {
    setToggling(user.id)
    try {
      const res = await axiosInstance.patch(`/authors/${user.id}/status`)
      // update local state with returned user
      const updated = res?.data
      setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u))
      showMsg(
        "success",
        `${updated.fullName} is now ${updated.verified ? " Active" : " Blocked"}`
      )
    } catch (err) {
      showMsg("error", err?.response?.data?.message || "Status update failed")
    } finally {
      setToggling(null)
    }
  }

  // ── DELETE ──
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    try {
      await axiosInstance.delete(`/authors/${id}`)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      showMsg("success", "User deleted successfully!")
    } catch (err) {
      showMsg("error", err?.response?.data?.message || "Failed to delete user")
    }
  }

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3500)
  }

  // ── FILTER ──
  const filtered = users.filter((u) => {
    const matchSearch =
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchFilter =
      filterStatus === "all"    ? true :
      filterStatus === "active" ? u.verified === true :
                                  u.verified === false
    return matchSearch && matchFilter
  })

  const totalUsers   = users.length
  const activeUsers  = users.filter((u) => u.verified === true).length
  const blockedUsers = users.filter((u) => u.verified === false).length

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—"

  return (
    <div className="flex-1 min-h-screen bg-background">

      {/* Header */}
      <div className="h-16 border-b border-border/50 flex items-center justify-between
                      px-6 md:px-8 sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
        <h1 className="text-xl font-bold tracking-tight">Users Management</h1>
      </div>

      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success"
              ? "bg-emerald-500/15 text-emerald-600"
              : "bg-red-500/15 text-red-600"
          }`}>
            {message.type === "success"
              ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
              : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:"Total Users",   value:totalUsers,   icon:Users,     gradient:"from-violet-500 to-indigo-600", color:""               },
            { label:"Active Users",  value:activeUsers,  icon:UserCheck, gradient:"from-emerald-500 to-teal-600",  color:"text-emerald-500"},
            { label:"Blocked Users", value:blockedUsers, icon:UserX,     gradient:"from-rose-500 to-red-600",      color:"text-rose-500"   },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="glass-card p-5 rounded-2xl flex items-center gap-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${s.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 bg-muted/40 p-1 rounded-xl">
            {[
              { key:"all",     label:"All"     },
              { key:"active",  label:"Active"  },
              { key:"blocked", label:"Blocked" },
            ].map((f) => (
              <button key={f.key} onClick={() => setFilterStatus(f.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === f.key
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-16 flex flex-col items-center gap-3 text-muted-foreground">
              <Loader className="w-7 h-7 animate-spin" />
              <p className="text-sm">Loading users...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 flex flex-col items-center gap-3 text-muted-foreground">
              <Users className="w-10 h-10 opacity-30" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <>
              {/* ── Desktop Table ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      {["#","User","Contact","Role","Status","Joined","Actions"].map(h => (
                        <th key={h} className="text-left px-6 py-4 font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filtered.map((user, i) => (
                      <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">{i + 1}</td>

                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-accent/60
                                            flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-medium">{user.fullName || "—"}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4 text-muted-foreground">{user.phone || "—"}</td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                           text-xs font-semibold bg-primary/10 text-primary">
                            <ShieldCheck className="w-3 h-3" />
                            {user.role || "AUTHOR"}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td className="px-6 py-4">
                          {user.verified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                             text-xs font-semibold bg-emerald-500/15 text-emerald-500">
                              <UserCheck className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                             text-xs font-semibold bg-rose-500/15 text-rose-500">
                              <UserX className="w-3 h-3" /> Blocked
                            </span>
                          )}
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(user.createdAt)}
                          </div>
                        </td>

                        {/* ── Actions ── */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">

                            {/* Block / Unblock button */}
                            <Button variant="ghost" size="sm"
                              disabled={toggling === user.id}
                              onClick={() => handleToggleStatus(user)}
                              className={`gap-1.5 text-xs font-semibold ${
                                user.verified
                                  ? "text-amber-500 hover:bg-amber-500/10 hover:text-amber-600"
                                  : "text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600"
                              }`}>
                              {toggling === user.id ? (
                                <Loader className="w-3.5 h-3.5 animate-spin" />
                              ) : user.verified ? (
                                <><ShieldOff className="w-3.5 h-3.5" /> Block</>
                              ) : (
                                <><UserCheck className="w-3.5 h-3.5" /> Unblock</>
                              )}
                            </Button>

                            {/* Delete button */}
                            <Button variant="ghost" size="sm"
                              onClick={() => handleDelete(user.id)}
                              className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile Cards ── */}
              <div className="md:hidden divide-y divide-border/30">
                {filtered.map((user) => (
                  <div key={user.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-accent/60
                                        flex items-center justify-center text-white font-bold">
                          {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.fullName || "—"}</p>
                          <p className="text-xs text-muted-foreground">{user.role || "AUTHOR"}</p>
                        </div>
                      </div>
                      {user.verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500">
                          <UserCheck className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-500">
                          <UserX className="w-3 h-3" /> Blocked
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-muted-foreground pl-1">
                      <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {user.email}</div>
                      {user.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {user.phone}</div>}
                      <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> Joined {formatDate(user.createdAt)}</div>
                    </div>

                    <div className="flex justify-end gap-2">
                      {/* Block/Unblock */}
                      <Button variant="ghost" size="sm"
                        disabled={toggling === user.id}
                        onClick={() => handleToggleStatus(user)}
                        className={`text-xs gap-1.5 ${
                          user.verified
                            ? "text-amber-500 hover:bg-amber-500/10"
                            : "text-emerald-500 hover:bg-emerald-500/10"
                        }`}>
                        {toggling === user.id
                          ? <Loader className="w-3.5 h-3.5 animate-spin" />
                          : user.verified
                          ? <><ShieldOff className="w-3.5 h-3.5" /> Block</>
                          : <><UserCheck className="w-3.5 h-3.5" /> Unblock</>
                        }
                      </Button>

                      {/* Delete */}
                      <Button variant="ghost" size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-rose-500 hover:bg-rose-500/10 text-xs">
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Showing {filtered.length} of {totalUsers} users
          </p>
        )}

      </div>
    </div>
  )
}