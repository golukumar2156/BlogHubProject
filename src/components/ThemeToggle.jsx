import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"

export function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative w-9 h-9 flex items-center justify-center rounded-xl
                  border border-border/50 bg-muted/30 hover:bg-muted/60
                  transition-all duration-200 text-muted-foreground hover:text-foreground
                  ${className}`}
    >
      {theme === "dark" ? (
        <Sun  className="w-4 h-4 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0" />
      )}
    </button>
  )
}