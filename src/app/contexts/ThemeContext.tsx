"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

type ThemeContextType = {
  dark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  dark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /* Flag `mounted` lama dihapus: efek sinkron di bawah hanya melakukan
   * classList.toggle + localStorage.setItem yang idempotent terhadap hasil
   * lazy initializer di atas, jadi aman dijalankan tepat setelah hydrate. */
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        document.documentElement.classList.contains("dark-theme") ||
        localStorage.getItem("theme") === "dark"
      );
    }
    return true; // Default fallback ke dark
  });

  // Sinkronkan class/localStorage setiap kali state berubah
  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleTheme = () => {
    if (!document.startViewTransition) {
      setDark((prev) => !prev);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setDark((prev) => !prev);
      });
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);