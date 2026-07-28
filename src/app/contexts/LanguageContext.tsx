"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "ID" | "EN";

type LanguageContextType = {
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "ID",
  toggleLang: () => {},
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("ID");

  // Load bahasa tersimpan saat mounting
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang === "ID" || savedLang === "EN") {
      setLangState(savedLang);
    }
  }, []);

  // Simpan perubahan bahasa ke localStorage
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  const toggleLang = () => {
    const nextLang = lang === "ID" ? "EN" : "ID";
    setLang(nextLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);