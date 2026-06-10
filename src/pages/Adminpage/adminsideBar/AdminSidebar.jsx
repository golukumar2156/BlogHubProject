import React, { useState } from "react"
import { LayoutGrid, FolderOpen, Users, LogOut, ChevronRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { resetAuth } from "@/Features/auth/authSlice"
import { ThemeToggle } from "@/components/ThemeToggle"

const navItems = [
  { href: "/admin",            label: "Dashboard",  icon: LayoutGrid },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/users",      label: "Users",      icon: Users      },
]

export function AdminSidebar() {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const location  = useLocation()
  const pathname  = location.pathname
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (href) => { navigate(href); setMobileOpen(false) }
  const handleLogout = () => { dispatch(resetAuth()); navigate("/login", { replace: true }) }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo + Theme Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-lg">B</span>
          </div>
          <span className="font-bold text-sidebar-foreground">Admin Panel</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon     = item.icon
          const isActive = pathname === item.href
          return (
            <div
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-sidebar-foreground hover:bg-accent/10"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border flex-shrink-0">
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
          <span className="font-bold text-sidebar-foreground">Admin Panel</span>
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
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent/10 text-sidebar-foreground">
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </div>
    </>
  )
}