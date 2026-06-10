import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutGrid, FileText, Settings, LogOut, ChevronRight, Menu, X, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { resetAuth } from "@/Features/auth/authSlice"
import { useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"

const navItems = [
  { href: "/dashboard",  label: "Overview",   icon: LayoutGrid },
  { href: "/my-blogs",   label: "My Blogs",   icon: FileText   },
  { href: "/my-profile", label: "My Profile", icon: UserCircle },
  { href: "/settings",   label: "Settings",   icon: Settings   },
]

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(resetAuth())
    navigate("/login", { replace: true })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo + Theme Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-lg">B</span>
          </div>
          <span className="font-bold text-sidebar-foreground">BlogHub</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon     = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-sidebar-primary/20 text-sidebar-primary font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10"
              }`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-4 border-t border-sidebar-border flex-shrink-0 space-y-3">
        <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600
                            flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {user?.fullName || "Author"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full border-sidebar-border hover:bg-red-500/10 hover:text-red-500
                     hover:border-red-500/30 bg-transparent text-sidebar-foreground justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex flex-col w-64 h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0 z-50">
        <SidebarContent />
      </div>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)}
                  className="p-2 rounded-lg hover:bg-accent/10 text-sidebar-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-sm">B</span>
          </div>
          <span className="font-bold text-sidebar-foreground">BlogHub</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-[60]
                       transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent/10 text-sidebar-foreground z-10">
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </div>
    </>
  )
}

export default Sidebar