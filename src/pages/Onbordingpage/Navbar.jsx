import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { resetAuth } from "@/Features/auth/authSlice"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Search, Menu, X, LogOut, LayoutDashboard, BookOpen, ShieldCheck, Globe, ChevronDown, Check } from "lucide-react"
import { useLang } from "@/i18n/LanguageContext"
import { translations } from "@/i18n/translations"

// ── Language Selector Dropdown ──
function LangSelector() {
  const { lang, changeLang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  const current = translations[lang] || translations.en

  return (
    <div ref={ref} className="relative">
      {/* Trigger button — same style as Login */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                   border border-border/50 text-muted-foreground
                   hover:text-foreground hover:bg-muted/40 transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border/60
                        bg-background/95 backdrop-blur-xl shadow-2xl z-[100] overflow-hidden
                        animate-in fade-in slide-in-from-top-2 duration-150">

          {/* Header */}
          <div className="px-3 py-2.5 border-b border-border/40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Select Language
            </p>
          </div>

          {/* Language list */}
          <div className="py-1.5 max-h-72 overflow-y-auto">
            {Object.entries(translations).map(([code, val]) => {
              const isActive = lang === code
              return (
                <button
                  key={code}
                  onClick={() => { changeLang(code); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors
                    ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted/50"
                    }`}
                >
                  <span className="text-base w-6 text-center">{val.flag}</span>
                  <span className="flex-1 text-left font-medium">{val.name}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Navbar ──
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchVal,  setSearchVal]  = useState("")
  const [langMobile, setLangMobile] = useState(false)

  const { user, token } = useSelector((s) => s.auth)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const location  = useLocation()
  const { lang, changeLang, t } = useLang()

  const isLoggedIn = !!(token || localStorage.getItem("token"))
  const activeUser = user || (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null)
  const isAdmin    = activeUser?.role === "ADMIN"

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/")

  const handleLogout = () => {
    dispatch(resetAuth())
    setMobileOpen(false)
    navigate("/login", { replace: true })
  }

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchVal.trim()) {
      navigate(`/blogs?q=${encodeURIComponent(searchVal.trim())}`)
      setSearchVal("")
      setMobileOpen(false)
    }
  }

  const navLinks = [
    { to: "/blogs",      label: t.nav.discover },
    { to: "/categories", label: t.nav.categories },
  ]

  const NavLink = ({ to, label, mobile = false }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`${mobile
        ? "block px-3 py-2.5 rounded-xl text-sm transition-colors"
        : "text-sm transition-colors"
      } ${isActive(to)
        ? "text-foreground font-semibold"
        : "text-muted-foreground hover:text-foreground"
      } ${mobile && isActive(to) ? "bg-muted/50" : mobile ? "hover:bg-muted/40" : ""}`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="glass-card fixed top-0 w-full z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to={isLoggedIn ? (isAdmin ? "/admin" : "/dashboard") : "/"}
            className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg
                            flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg hidden sm:inline tracking-tight">BlogHub</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => <NavLink key={l.to} {...l} />)}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-1 justify-end">

            {/* Search bar */}
            <div className="hidden sm:flex items-center gap-2 bg-muted/30 border border-border/40
                            rounded-xl px-3 py-2 text-sm flex-1 max-w-[220px] lg:max-w-[260px]">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder={t.nav.search}
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
              />
            </div>

            {/* 🌐 Language Selector */}
            <LangSelector />

            <ThemeToggle />

            {/* Auth — desktop */}
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                              transition-colors border
                              ${isActive(isAdmin ? "/admin" : "/dashboard")
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "border-border/50 text-muted-foreground hover:bg-muted/40 hover:text-foreground"}`}
                >
                  {isAdmin
                    ? <><ShieldCheck className="w-3.5 h-3.5" /> {t.nav.admin}</>
                    : <><LayoutDashboard className="w-3.5 h-3.5" /> {t.nav.dashboard}</>
                  }
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                             border border-border/50 text-muted-foreground hover:text-red-500
                             hover:bg-red-500/10 hover:border-red-500/20 transition-colors">
                  <LogOut className="w-3.5 h-3.5" /> {t.nav.logout}
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-border/50
                             text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
                  {t.nav.login}
                </Link>
                <Link to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold
                             bg-gradient-to-r from-violet-600 to-indigo-600 text-white
                             hover:opacity-90 transition-opacity shadow-sm shadow-violet-500/20">
                  {t.nav.signup}
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-muted/50 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-3 border-t border-border/40 space-y-1">

            {/* Mobile search */}
            <div className="flex items-center gap-2 bg-muted/30 border border-border/40
                            rounded-xl px-3 py-2 mb-2">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder={t.nav.search}
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
              />
            </div>

            {navLinks.map(l => <NavLink key={l.to} {...l} mobile />)}

            {/* Mobile Language Selector */}
            <div className="px-1 py-1">
              <button
                onClick={() => setLangMobile(v => !v)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm hover:bg-muted/40 transition-colors"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span className="flex-1 text-left">Language — {translations[lang]?.flag} {translations[lang]?.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${langMobile ? "rotate-180" : ""}`} />
              </button>

              {langMobile && (
                <div className="mt-1 ml-3 space-y-0.5 border-l-2 border-primary/20 pl-3">
                  {Object.entries(translations).map(([code, val]) => (
                    <button
                      key={code}
                      onClick={() => { changeLang(code); setLangMobile(false); setMobileOpen(false) }}
                      className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors
                        ${lang === code ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
                    >
                      <span>{val.flag}</span>
                      <span>{val.name}</span>
                      {lang === code && <Check className="w-3.5 h-3.5 ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl hover:bg-muted/40 transition-colors"
                >
                  {isAdmin ? <ShieldCheck className="w-4 h-4 text-primary" /> : <LayoutDashboard className="w-4 h-4 text-primary" />}
                  {isAdmin ? t.nav.admin : t.nav.dashboard}
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl
                             text-red-500 hover:bg-red-500/10 transition-colors">
                  <LogOut className="w-4 h-4" /> {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm rounded-xl hover:bg-muted/40 transition-colors">
                  {t.nav.login}
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm rounded-xl font-semibold
                             text-primary hover:bg-primary/10 transition-colors">
                  {t.nav.signup} →
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}