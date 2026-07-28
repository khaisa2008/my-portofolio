"use client";

import { useEffect, useRef, useState } from "react";

export default function useNav() {
  const [active, setActive] = useState("home");
  const isClicking = useRef(false);

  const handleClick = (id: string) => {
    isClicking.current = true;

    setActive(id);

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // delay biar scroll spy tidak override saat animasi scroll
    setTimeout(() => {
      isClicking.current = false;
    }, 800);
  };

  useEffect(() => {
    const sections = ["home", "about", "skills", "projects", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClicking.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.6, // 60% section kelihatan = active
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return {
    active,
    handleClick,
  };
}