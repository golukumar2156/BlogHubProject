import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutGrid, FileText, Settings, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/my-blogs", label: "My Blogs", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
]

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // 🔥 GET USER FROM LOCALSTORAGE
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Demo User",
    email: "demo@bloghub.com",
  }

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0">
      
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="w-8 h-8 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-lg flex items-center justify-center">
          <span className="font-bold text-sidebar-primary-foreground text-lg">B</span>
        </div>
        <span className="ml-3 font-bold text-sidebar-foreground">BlogHub</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.href)

          return (
            <Link key={item.href} to={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-sidebar-primary/20 text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* 🔥 USER + LOGOUT SECTION */}
      <div className="px-4 py-6 border-t border-sidebar-border">
        
        {/* User Info */}
        <div className="mb-4 p-3 rounded-lg bg-sidebar-accent/10">
          <p className="font-semibold text-sm text-sidebar-foreground">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full border-sidebar-border hover:bg-sidebar-accent/20 bg-transparent text-sidebar-foreground justify-start"
          onClick={() => {
            localStorage.removeItem("user")
            navigate("/login")
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
