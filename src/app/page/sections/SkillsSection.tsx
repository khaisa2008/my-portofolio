"use client";

import { useEffect } from "react";

import { useLanguage } from "@/app/contexts/LanguageContext";
import { useIntersectionObserver } from "@/app/functions/UseIntersectionObserver";
import { useTheme } from "@/app/contexts/ThemeContext";
import UseParticle from "@/app/functions/UseParticleSection";

// Kamus Teks untuk Multi-Bahasa
const content = {
  ID: {
    title: "Keahlian",
    subtitle: "Teknologi yang saya gunakan",
  },
  EN: {
    title: "Skills",
    subtitle: "Technologies I use",
  },
};

// Data Skill beserta Ikon Devicon
const skillsData = [
  // --- BAHASA PEMROGRAMAN ---
  { name: "HTML", iconClass: "devicon-html5-plain colored" },
  { name: "CSS", iconClass: "devicon-css3-plain colored" },
  { name: "JavaScript", iconClass: "devicon-javascript-plain colored" },
  { name: "TypeScript", iconClass: "devicon-typescript-plain colored" },
  { name: "PHP", iconClass: "devicon-php-plain colored" },
  { name: "Java", iconClass: "devicon-java-plain colored" },

  // --- FRAMEWORK & LIBRARY ---
  { name: "React", iconClass: "devicon-react-original colored" },
  { name: "Next.js", iconClass: "devicon-nextjs-plain" },
  { name: "Laravel", iconClass: "devicon-laravel-original colored" },
  { name: "Tailwind CSS", iconClass: "devicon-tailwindcss-plain colored" },
  // { name: "Bootstrap", iconClass: "devicon-bootstrap-plain colored" },

  // --- DATABASE ---
  { name: "MySQL", iconClass: "devicon-mysql-plain colored" },
  { name: "PostgreSQL", iconClass: "devicon-postgresql-plain colored" },
];

export default function SkillsSection() {
  const { lang } = useLanguage();
  const t = content[lang];

  // Gunakan hook Intersection Observer (persis seperti di HomeSection)
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  const { dark } = useTheme();
  const { initParticles } = UseParticle();

  useEffect(() => {
    const cleanup = initParticles();

    return () => {
      cleanup?.();
    };
  }, [initParticles, dark]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`skills-section py-5 scroll-margin-top ${isVisible ? "active" : ""}`}
    >
      <canvas className="particle-skills" id="particleCanvas"></canvas>

      <div className="gradient-overlay-bottom" />
      <div className="container content-skills">
        <div className="section-title text-center mb-5">
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        <div className="row g-4">
          {skillsData.map((skill, index) => (
            <div className="col-6 col-md-4 col-lg-3" key={skill.name}>
              <div
                className="skill-card text-center p-4 h-100 d-flex flex-column align-items-center justify-content-center"
                style={{ "--delay": index } as React.CSSProperties}
              >
                <i className={`${skill.iconClass} display-4 mb-3`}></i>
                <h5 className="m-0">{skill.name}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
