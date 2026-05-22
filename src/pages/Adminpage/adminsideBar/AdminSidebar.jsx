import React from "react"
import { LayoutGrid, FolderOpen, Users, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocation, useNavigate } from "react-router-dom"

// Dummy navigation items
const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/users", label: "Users", icon: Users },
]

export function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <span className="font-bold text-primary-foreground text-lg">B</span>
        </div>
        <span className="ml-3 font-bold text-sidebar-foreground">BlogHub Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <div
              key={item.href}
              onClick={() => navigate(item.href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                isActive ? "bg-primary/20 text-primary" : "text-sidebar-foreground hover:bg-accent/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-sidebar-border">
        <Button
          variant="outline"
          className="w-full border-sidebar-border hover:bg-accent/20 bg-transparent text-sidebar-foreground justify-start"
          onClick={() => alert("Logout clicked")}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
