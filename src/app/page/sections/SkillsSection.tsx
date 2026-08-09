"use client";

import { useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useIntersectionObserver } from "@/app/functions/UseIntersectionObserver";

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

interface SkillItem {
  name: string;
  iconClass: string;
  desc: {
    ID: string;
    EN: string;
  };
}

const skillsData: SkillItem[] = [
  // --- BAHASA PEMROGRAMAN ---
  {
    name: "HTML",
    iconClass: "devicon-html5-plain colored",
    desc: {
      ID: "bahasa markup standar yang digunakan untuk membuat dan menyusun kerangka dasar sebuah halaman web",
      EN: "standard markup language used to create and structure the basic layout of web pages",
    },
  },
  {
    name: "CSS",
    iconClass: "devicon-css3-plain colored",
    desc: {
      ID: "bahasa lembar gaya yang digunakan untuk mengatur tampilan, tata letak, dan desain halaman web",
      EN: "style sheet language used for describing the presentation and design of web pages",
    },
  },
  {
    name: "JavaScript",
    iconClass: "devicon-javascript-plain colored",
    desc: {
      ID: "bahasa pemrograman tingkat tinggi untuk memberikan interaktivitas dan dinamika pada halaman web",
      EN: "high-level programming language used to add interactivity and dynamic content to web pages",
    },
  },
  {
    name: "TypeScript",
    iconClass: "devicon-typescript-plain colored",
    desc: {
      ID: "superset dari JavaScript yang menambahkan sistem tipe statis untuk meminimalkan error pada skala besar",
      EN: "strongly typed programming language that builds on JavaScript for better large-scale development",
    },
  },
  {
    name: "PHP",
    iconClass: "devicon-php-plain colored",
    desc: {
      ID: "bahasa skrip server-side yang dirancang khusus untuk pengembangan aplikasi web dinamis",
      EN: "popular server-side scripting language designed primarily for dynamic web development",
    },
  },
  {
    name: "Java",
    iconClass: "devicon-java-plain colored",
    desc: {
      ID: "bahasa pemrograman berorientasi objek yang tangguh untuk aplikasi desktop, web, dan enterprise",
      EN: "robust object-oriented programming language used for building desktop and enterprise applications",
    },
  },

  // --- FRAMEWORK & LIBRARY ---
  {
    name: "React",
    iconClass: "devicon-react-original colored",
    desc: {
      ID: "pustaka JavaScript deklaratif berbasis komponen untuk membangun antarmuka pengguna yang responsif",
      EN: "component-based JavaScript library for building fast and interactive user interfaces",
    },
  },
  {
    name: "Next.js",
    iconClass: "devicon-nextjs-plain",
    desc: {
      ID: "framework React full-stack dengan fitur Server-Side Rendering (SSR) dan optimasi otomatis",
      EN: "full-stack React framework enabling server-side rendering and static site generation",
    },
  },
  {
    name: "Laravel",
    iconClass: "devicon-laravel-original colored",
    desc: {
      ID: "framework PHP berbasis MVC yang menyediakan sintaks elegan untuk membangun web backend modern",
      EN: "elegant PHP web framework designed for expressive, robust backend development",
    },
  },
  {
    name: "Tailwind CSS",
    iconClass: "devicon-tailwindcss-plain colored",
    desc: {
      ID: "framework CSS utility-first untuk mempercepat pembuatan desain antarmuka kustom secara fleksibel",
      EN: "utility-first CSS framework for rapidly building custom, responsive user interfaces",
    },
  },

  // --- DATABASE ---
  {
    name: "MySQL",
    iconClass: "devicon-mysql-plain colored",
    desc: {
      ID: "sistem manajemen basis data relasional (RDBMS) berbasis SQL yang cepat dan andal",
      EN: "relational database management system (RDBMS) based on SQL for fast data operations",
    },
  },
  {
    name: "PostgreSQL",
    iconClass: "devicon-postgresql-plain colored",
    desc: {
      ID: "sistem basis data objek-relasional tingkat lanjut yang mengutamakan skalabilitas dan integritas data",
      EN: "advanced open-source object-relational database system emphasizing compliance and extensibility",
    },
  },
];

export default function SkillsSection() {
  const { lang } = useLanguage();
  const t = content[lang];

  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [sectionRef, isVisible, direction] = useIntersectionObserver({
    threshold: 0.2,
  });

  const getAnimationClass = () => {
    if (!isVisible) return "";
    return direction === "down" ? "active active-down" : "active active-up";
  };

  const handleCardClick = (name: string) => {
    // 1. Jika mengklik card yang sama (sudah aktif), tutup card tersebut
    if (activeSkill === name) {
      setActiveSkill(null);
      return;
    }

    // 2. Jika ada card lain yang sedang terbuka
    if (activeSkill !== null) {
      // Step A: Tutup card yang sedang aktif terlebih dahulu
      setActiveSkill(null);

      // Step B: Tunggu hingga durasi rotasi flip selesai (500ms / 0.5s sesuai CSS), baru buka card baru
      setTimeout(() => {
        setActiveSkill(name);
      }, 500); // 500ms disesuaikan dengan transition duration di CSS (.skill-card-inner = 0.5s)
    } else {
      // 3. Jika belum ada card yang terbuka, buka langsung
      setActiveSkill(name);
    }
  };

  const activeIndex = skillsData.findIndex((s) => s.name === activeSkill);
  const activeRow = activeIndex !== -1 ? Math.floor(activeIndex / 4) : -1;

  const getColClass = (index: number) => {
    if (activeRow === -1) {
      return "col-6 col-md-4 col-lg-3";
    }

    const currentRow = Math.floor(index / 4);

    if (currentRow === activeRow) {
      if (index === activeIndex) {
        // Card aktif membesar (6 kolom)
        return "col-12 col-md-6 col-lg-6 active-expanded";
      } else {
        // Card lain di baris yang sama mengecil (2 kolom: 6 + 2 + 2 + 2 = 12)
        return "col-4 col-md-3 col-lg-2 active-shrunk";
      }
    }

    return "col-6 col-md-4 col-lg-3";
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`skills-section py-5 scroll-margin-top ${getAnimationClass()}`}
    >
      <div className="gradient-overlay-bottom" />
      <div className="container content-skills">
        <div className="section-title text-center mb-5">
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        <div className="row g-4 transition-grid align-items-center">
          {skillsData.map((skill, index) => {
            const isFlipped = skill.name === activeSkill;
            const skillDesc = skill.desc[lang];

            return (
              <div
                className={`grid-col-transition ${getColClass(index)}`}
                key={skill.name}
              >
                <div
                  className="skill-card-wrapper"
                  onClick={() => handleCardClick(skill.name)}
                  style={{ "--delay": index } as React.CSSProperties}
                >
                  <div
                    className={`skill-card-inner ${isFlipped ? "is-flipped" : ""}`}
                  >
                    {/* --- SISI DEPAN CARD --- */}
                    <div className="skill-card skill-card-front text-center p-3 d-flex flex-column align-items-center justify-content-center">
                      <i className={`${skill.iconClass} display-4 mb-3`}></i>
                      <h5 className="m-0 fw-semibold">{skill.name}</h5>
                    </div>

                    {/* --- SISI BELAKANG CARD (LAYOUT SESUAI GAMBAR) --- */}
                    <div className="skill-card skill-card-back p-3 d-flex align-items-center gap-3 text-start">
                      <i
                        className={`${skill.iconClass} skill-icon-back flex-shrink-0`}
                      ></i>
                      <div className="skill-info-content">
                        <h5 className="fw-bold mb-1 text-uppercase">
                          {skill.name}
                        </h5>
                        <p className="skill-desc-text m-0">{skillDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
