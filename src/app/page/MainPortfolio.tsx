"use client";
import { useEffect } from "react";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, destroyLenis } from "@/app/functions/LenisSingleton";
import HomeSection from "./sections/HomeSection";
import AboutSection from "./sections/AboutSection";
import SkillsSection from "./sections/SkillsSection";
import ProjectsSection from "./sections/ProjectsSection";
import ContactSection from "./sections/ContactSection";
import Navbar from "./sections/Navbar";

import AnimatedBackground from "@/app/components/AnimatedBackground";
import FloatingSettings from "@/app/components/FloatingSettings";

import "@/app/animation/HomeSection.css";
import "@/app/animation/AboutSection.css";
import "@/app/animation/SkilsSection.css";
import "@/app/animation/ProjectsSection.css";

import UseParticle from "@/app/functions/UseParticleSection";
import { useTheme } from "@/app/contexts/ThemeContext";

export default function MainPortfolio() {
  const { initParticles } = UseParticle();
  const { dark } = useTheme();

  useEffect(() => {
    const cleanup = initParticles();

    return () => {
      cleanup?.();
    };
  }, [initParticles, dark]);

  /* Cursor spotlight: 1 listener terdelegasi untuk semua kartu, bukan
   * listener per kartu. Menulis --mx/--my langsung ke DOM (tanpa React state,
   * tanpa re-render) — CSS radial-gradient yang membaca nilainya. */
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const card = target?.closest<HTMLElement>(
        ".skill-card-front, .ps-card, .glass-card",
      );
      if (!card) return;

      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Setup Lenis Smooth Scroll Terintegrasi GSAP
  useEffect(() => {
    const lenis = getLenis();

    // Hubungkan event scroll Lenis ke GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    /* lagSmoothing(0) = GSAP memakai delta mentah, jadi clock gsap.ticker dan
     * clock Lenis tidak pernah menyimpang. Tanpa ini, setelah satu frame
     * lambat GSAP "menahan" waktunya sendiri sementara Lenis tidak — lenis.raf
     * lalu dipanggil dengan timestamp yang salah urutan dan scroll meloncat. */
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.off("scroll", ScrollTrigger.update);
      destroyLenis();
    };
  }, []);

  return (
    <>
      <canvas className="particle-section" id="particleCanvas"></canvas>

      <AnimatedBackground />

      {/* Navbar di luar #main: krom ini di-scale sendiri oleh UseZoomLock, dan
          scale di dalam #main akan ikut memengaruhi position: fixed-nya. */}
      <Navbar />

      {/* <main> (bukan div): landmark landmark untuk screen reader;
          id "main" dipertahankan karena dipakai banyak selektor CSS. */}
      <main id="main">
        <img src="/element/code.avif" className="code-img" alt="code" />

        {/* ================= HOME ================= */}
        <HomeSection />

        {/* ================= ABOUT ================= */}
        <AboutSection />

        {/* ================= SKILLS ================= */}
        <SkillsSection />

        {/* ================= PROJECTS ================= */}
        <ProjectsSection />

        {/* ================= CONTACT ================= */}
        <ContactSection />

        {/* ================= FOOTER ================= */}
        <footer className="site-footer text-center py-4">
          <img
            src="/element/code.avif"
            className="footer-code-img"
            alt=""
            aria-hidden="true"
          />
          <p className="footer-copy mb-1">
            © {new Date().getFullYear()} My Portfolio | Designed with Next.js
            &amp; Bootstrap
          </p>
          <p className="footer-note mb-0">
            Built &amp; designed by hand — cyan &amp; glass
          </p>
          <button
            type="button"
            className="back-to-top"
            onClick={() => getLenis().scrollTo(0, { duration: 1 })}
          >
            ↑ Back to top
          </button>
        </footer>
      </main>

      {/* Floating settings di luar #main dengan alasan yang sama seperti Navbar. */}
      <FloatingSettings />
    </>
  );
}
