import React, { useState } from "react"
import { Search, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // UI-only flags (Redux baad me)
  const isLoggedIn = false
  const user = null

  return (
    <nav className="glass-card fixed top-0 w-full z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-lg">B</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">BlogHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/blogs"
              className="text-muted-foreground hover:text-foreground smooth-transition"
            >
              Discover
            </Link>
            <Link
              to="/categories"
              className="text-muted-foreground hover:text-foreground smooth-transition"
            >
              Categories
            </Link>
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search blogs..."
                className="bg-transparent outline-none text-sm w-32 placeholder-muted-foreground"
              />
            </div>

            {isLoggedIn ? (
              <>
                <Link to={user?.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button variant="ghost" size="sm">
                    {user?.role === "admin" ? "Admin" : "Dashboard"}
                  </Button>
                </Link>

                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border/50">
            <Link
              to="/blogs"
              className="block px-2 py-2 text-sm hover:bg-muted/50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Discover
            </Link>
            <Link
              to="/categories"
              className="block px-2 py-2 text-sm hover:bg-muted/50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="block px-2 py-2 text-sm hover:bg-muted/50 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-2 py-2 text-sm hover:bg-muted/50 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
