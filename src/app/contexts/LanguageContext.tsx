"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

type Language = "ID" | "EN";

type LanguageContextType = {
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
};

const STORAGE_KEY = "lang";

/* localStorage diperlakukan sebagai external store (bukan state yang
 * di-load lewat setState di dalam effect — dilarang react-hooks/
 * set-state-in-effect, dan berisiko hydration mismatch). */
const listeners = new Set<() => void>();

const readLang = (): Language => {
  if (typeof window === "undefined") return "EN";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "ID" || saved === "EN" ? saved : "EN";
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const notify = () => {
  listeners.forEach((listener) => listener());
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "ID",
  toggleLang: () => {},
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore<Language>(subscribe, readLang, () => "EN");

  // Sinkronkan atribut lang pada <html> (screen reader + SEO)
  useEffect(() => {
    document.documentElement.lang = lang === "ID" ? "id" : "en";
  }, [lang]);

  const setLang = (newLang: Language) => {
    window.localStorage.setItem(STORAGE_KEY, newLang);
    notify();
  };

  const toggleLang = () => {
    setLang(lang === "ID" ? "EN" : "ID");
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
