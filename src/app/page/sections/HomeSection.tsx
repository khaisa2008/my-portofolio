"use client"; // Pastikan ada directive ini untuk Next.js App Router

import Image from "next/image";

import OrbitIcon from "@/app/components/OrbitIcon";
import useHeaderText from "@/app/functions/UseHeaderText";
import { useIntersectionObserver } from "@/app/functions/UseIntersectionObserver";

import { useLanguage } from "@/app/contexts/LanguageContext";

const content = {
  ID: {
    badge: "Bersedia untuk Freelance",
    subtitle: "Pengembang Web Fullstack",
    description:
      "Saya membangun situs web modern, responsif, dan mudah digunakan dengan pengalaman UI/UX yang menarik. Memiliki passion dalam menciptakan produk digital yang cepat, elegan, dan interaktif.",
    hireBtn: "Sewa Saya",
    cvBtn: "Unduh CV",
  },
  EN: {
    badge: "Available For Freelance",
    subtitle: "Fullstack Web Developer",
    description:
      "I build modern, responsive and user-friendly websites with beautiful UI/UX experiences. Passionate about creating digital products that are fast, elegant and interactive.",
    hireBtn: "Hire Me",
    cvBtn: "Download CV",
  },
};

export default function HomeSection() {
  const { prefixText, nameText, activeCursor } = useHeaderText();
  const { lang } = useLanguage();

  const t = content[lang];

  // Gunakan hook Intersection Observer
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.25 });

  return (
    <section
      id="home"
      ref={sectionRef} // Pasang ref di sini
      className={`hero-section scroll-margin-top-hero ${isVisible ? "active" : ""}`} // Class active ditambahkan saat isVisible = true
    >
      {/* Background decorative elements */}
      <div className="hero-bg-glow"></div>

      {/* Floating hexagons */}
      <div className="hex hex1">
        <Image src="/element/hex.png" width={100} height={100}  alt="hexagon" />
      </div>
      <div className="hex hex2">
        <Image src="/element/hex.png" width={170} height={170} alt="hexagon" />
      </div>
      <div className="hex hex3">
        <Image src="/element/hex.png" width={150} height={150} alt="hexagon" />
      </div>
      <div className="hex hex4">
        <Image src="/element/hex.png" width={120} height={120} alt="hexagon" />
      </div>

      <Image
        src="/element/polcadot.png"
        className="polcadot-img"
        width={100} height={100}
        alt="polcadot"
      />
      <Image
        src="/element/polcadot.png"
        className="polcadot-img2"
        width={90} height={90}
        alt="polcadot"
      />

      <div className="container-home">
        <div className="row align-items-center min-vh-100 px-2">
          {/* LEFT CONTENT */}
          <div className="col-lg-6 hero-left">
            <span className="badge badge-title bg-info text-dark px-3 py-2 rounded-pill">
              {t.badge}
            </span>
            <h1 className="hero-title mt-4">
              <span
                className={`prefix-text ${activeCursor === "prefix" ? "cursor" : ""}`}
              >
                {prefixText}
              </span>
              <span
                className={`name-text ${activeCursor === "name" ? "cursor" : ""}`}
              >
                {nameText}
              </span>
            </h1>
            <h2 className="hero-subtitle"> {t.subtitle} </h2>
            <p className="hero-text mt-4">{t.description}</p>
            <div className="button-home mt-4 d-flex gap-3 flex-wrap">
              <button className="btn btn-info btn-lg rounded-pill px-4">
                <i className="bi bi-send"></i> {t.hireBtn}
              </button>
              <button
                className="btn btn-lg rounded-pill px-4 btn-theme-outline"
              >
                <i className="bi bi-download"></i> {t.cvBtn}
              </button>
            </div>
            <div className="social-icons mt-3">
              <i className="bi bi-github"></i>
              <i className="bi bi-linkedin"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-discord"></i>
            </div>
          </div>

          {/* RIGHT CONTENT: 3D Character + Orbiting Icons */}
          <div className="col-lg-6 pe-3">
            <div className="hero-right">
              {/* Orbit rings */}
              <div className="orbit-wrapper">
                <div className="orbit-ring"></div>
                <div className="orbit-ring orbit-ring-2"></div>

                {/* Character */}
                <Image src="/pro.avif" alt="profile" width={450} height={700} className="hero-img" />
                {/* <img src="/pro.png" alt="profile" className="hero-img" /> */}
                
                {/* Orbit Icons: Anda bisa mengirim prop `isActive={isVisible}` jika butuh kontrol di dalam komponen OrbitIcon */}
                {isVisible && (
                  <>
                    {/* 3D Icons with orbit animation */}
                    <OrbitIcon
                      image="/element/laravel.png"
                      size={110}
                      radiusX={255}
                      radiusY={250}
                      startAngle={288}
                      speed={0.25}
                      glow="#ff2d20"
                      initialDelay={2100}
                    />
                    <OrbitIcon
                      image="/element/react.png"
                      size={110}
                      radiusX={270}
                      radiusY={260}
                      startAngle={0}
                      speed={0.25}
                      glow="#61dafb"
                      initialDelay={1650}
                    />
                    <OrbitIcon
                      image="/element/js.png"
                      size={110}
                      radiusX={250}
                      radiusY={250}
                      startAngle={72}
                      speed={0.25}
                      glow="#f7df1e"
                      initialDelay={1200}
                    />
                    <OrbitIcon
                      image="/element/css.png"
                      size={110}
                      radiusX={260}
                      radiusY={255}
                      startAngle={144}
                      speed={0.25}
                      glow="#2965f1"
                      initialDelay={800}
                    />
                    <OrbitIcon
                      image="/element/html.png"
                      size={110}
                      radiusX={240}
                      radiusY={245}
                      startAngle={216}
                      speed={0.25}
                      glow="#ff5722"
                      initialDelay={300}
                    />
                  </>
                )}
              </div>
              {/* Source card */}
              <Image
                src="/element/source_code.png"
                width={180}
                height={180}
                className="source-card"
                alt="source code"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="gradient-overlay-top" />
    </section>
  );
}
