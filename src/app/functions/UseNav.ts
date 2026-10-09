"use client";

import { useEffect, useRef, useState } from "react";
import { getLenis } from "@/app/functions/LenisSingleton";

export default function useNav() {
  const [active, setActive] = useState("home");
  const isClicking = useRef(false);

  useEffect(() => {
    /* Instance Lenis DIMILIKI MainPortfolio (singleton).
     *
     * Scroll-spy memakai event scroll Lenis + garis 40% viewport, BUKAN
     * IntersectionObserver(threshold: 0.5):
     *  - section Projects di-pin & tingginya berkali-kali viewport, jadi
     *    ratio 0.5 tidak pernah tercapai dan nav tidak pernah aktif;
     *  - IntersectionObserver hanya melaporkan entry yang BERUBAH, jadi
     *    state bisa tertinggal. Position-based selalu punya jawaban. */
    const lenis = getLenis();
    const ids = ["home", "about", "skills", "projects", "contact"];

    const compute = () => {
      // Selama animasi scrollTo programatik berjalan, klik user yang menang.
      if (isClicking.current) return;

      const line = window.innerHeight * 0.4;
      let current = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    lenis.on("scroll", compute);
    window.addEventListener("resize", compute);
    compute();

    return () => {
      lenis.off("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const handleClick = (id: string) => {
    isClicking.current = true;
    setActive(id);

    const el = document.getElementById(id);
    if (!el) {
      isClicking.current = false;
      return;
    }

    /* JANGAN hanya andalkan onComplete Lenis: kalau user menarik scroll
     * di tengah animasi, callback itu tidak pernah dipanggil dan scroll-spy
     * akan terkunci pada menu klik terakhir selamanya. Timeout adalah
     * pengaman, dan scroll manual user langsung melepas kunci. */
    const release = () => {
      if (!isClicking.current) return;
      isClicking.current = false;
    };
    const releaseTimer = window.setTimeout(release, 1400);
    const releaseOnUserScroll = () => {
      release();
      cleanup();
    };
    const cleanup = () => {
      window.clearTimeout(releaseTimer);
      window.removeEventListener("wheel", releaseOnUserScroll);
      window.removeEventListener("touchstart", releaseOnUserScroll);
      window.removeEventListener("keydown", onKey);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key.startsWith("Arrow") || e.key === "PageUp" || e.key === "PageDown" || e.key === "Home" || e.key === "End") {
        release();
        cleanup();
      }
    };

    window.addEventListener("wheel", releaseOnUserScroll, { passive: true });
    window.addEventListener("touchstart", releaseOnUserScroll, { passive: true });
    window.addEventListener("keydown", onKey);

    getLenis().scrollTo(el, {
      duration: 1.2,
      onComplete: cleanup,
    });
  };

  return {
    active,
    handleClick,
  };
}
