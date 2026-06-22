import { createContext, useContext, useState } from "react"
import { translations } from "./translations"

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("bloghub-lang") || "en"
  )

  function changeLang(code) {
    setLang(code)
    localStorage.setItem("bloghub-lang", code)
  }

  const t = translations[lang] || translations.en

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider")
  return ctx
}