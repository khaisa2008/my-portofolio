"use client";

import HomeSection from "./sections/HomeSection";
import AboutSection from "./sections/AboutSection";
import SkillsSection from "./sections/SkillsSection";
import ProjectsSection from "./sections/ProjectsSection";
import ContactSection from "./sections/ContactSection";
import Navbar from "./sections/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import "../animation/HomeSection.css";

export default function MainPortfolio() {
  return (
    <>
      <AnimatedBackground />

      <div id="main">
        <img
          src="/element/polcadot.png"
          className="poldacot-img2"
          alt="polcadot"
        />
        <img src="/element/code.png" className="code-img" alt="code" />

        {/* ================= NAVBAR ================= */}
        <Navbar />

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
        <footer className="text-center py-4">
          <p>© 2026 My Portfolio | Designed with Next.js & Bootstrap</p>
        </footer>
      </div>
    </>
  );
}
