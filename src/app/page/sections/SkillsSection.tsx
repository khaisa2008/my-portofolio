"use client";

import { useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useIntersectionObserver } from "@/app/functions/UseIntersectionObserver";

const content = {
  ID: {
    title: "Keahlian",
    subtitle: "Teknologi yang saya gunakan",
    flipHint: "lihat detail",
  },
  EN: {
    title: "Skills",
    subtitle: "Technologies I use",
    flipHint: "show details",
  },
};

interface SkillItem {
  name: string;
  iconClass: string;
  category: "lang" | "framework" | "database";
  desc: {
    ID: string;
    EN: string;
  };
}

const CATEGORY_LABEL: Record<SkillItem["category"], { ID: string; EN: string }> = {
  lang: { ID: "Bahasa", EN: "Language" },
  framework: { ID: "Framework", EN: "Framework" },
  database: { ID: "Database", EN: "Database" },
};

const skillsData: SkillItem[] = [
  // --- BAHASA PEMROGRAMAN ---
  {
    name: "HTML",
    iconClass: "skill-icon icon-html5",
    category: "lang",
    desc: {
      ID: "bahasa markup standar yang digunakan untuk membuat dan menyusun kerangka dasar sebuah halaman web",
      EN: "standard markup language used to create and structure the basic layout of web pages",
    },
  },
  {
    name: "CSS",
    iconClass: "skill-icon icon-css3",
    category: "lang",
    desc: {
      ID: "bahasa lembar gaya yang digunakan untuk mengatur tampilan, tata letak, dan desain halaman web",
      EN: "style sheet language used for describing the presentation and design of web pages",
    },
  },
  {
    name: "JavaScript",
    iconClass: "skill-icon icon-javascript",
    category: "lang",
    desc: {
      ID: "bahasa pemrograman tingkat tinggi untuk memberikan interaktivitas dan dinamika pada halaman web",
      EN: "high-level programming language used to add interactivity and dynamic content to web pages",
    },
  },
  {
    name: "TypeScript",
    iconClass: "skill-icon icon-typescript",
    category: "lang",
    desc: {
      ID: "superset dari JavaScript yang menambahkan sistem tipe statis untuk meminimalkan error pada skala besar",
      EN: "strongly typed programming language that builds on JavaScript for better large-scale development",
    },
  },
  {
    name: "PHP",
    iconClass: "skill-icon icon-php",
    category: "lang",
    desc: {
      ID: "bahasa skrip server-side yang dirancang khusus untuk pengembangan aplikasi web dinamis",
      EN: "popular server-side scripting language designed primarily for dynamic web development",
    },
  },
  {
    name: "Java",
    iconClass: "skill-icon icon-java",
    category: "lang",
    desc: {
      ID: "bahasa pemrograman berorientasi objek yang tangguh untuk aplikasi desktop, web, dan enterprise",
      EN: "robust object-oriented programming language used for building desktop and enterprise applications",
    },
  },

  // --- FRAMEWORK & LIBRARY ---
  {
    name: "React",
    iconClass: "skill-icon icon-react",
    category: "framework",
    desc: {
      ID: "pustaka JavaScript deklaratif berbasis komponen untuk membangun antarmuka pengguna yang responsif",
      EN: "component-based JavaScript library for building fast and interactive user interfaces",
    },
  },
  {
    name: "Next.js",
    iconClass: "skill-icon icon-nextjs",
    category: "framework",
    desc: {
      ID: "framework React full-stack dengan fitur Server-Side Rendering (SSR) dan optimasi otomatis",
      EN: "full-stack React framework enabling server-side rendering and static site generation",
    },
  },
  {
    name: "Laravel",
    iconClass: "skill-icon icon-laravel",
    category: "framework",
    desc: {
      ID: "framework PHP berbasis MVC yang menyediakan sintaks elegan untuk membangun web backend modern",
      EN: "elegant PHP web framework designed for expressive, robust backend development",
    },
  },
  {
    name: "Tailwind CSS",
    iconClass: "skill-icon icon-tailwindcss",
    category: "framework",
    desc: {
      ID: "framework CSS utility-first untuk mempercepat pembuatan desain antarmuka kustom secara fleksibel",
      EN: "utility-first CSS framework for rapidly building custom, responsive user interfaces",
    },
  },

  // --- DATABASE ---
  {
    name: "MySQL",
    iconClass: "skill-icon icon-mysql",
    category: "database",
    desc: {
      ID: "sistem manajemen basis data relasional (RDBMS) berbasis SQL yang cepat dan andal",
      EN: "relational database management system (RDBMS) based on SQL for fast data operations",
    },
  },
  {
    name: "PostgreSQL",
    iconClass: "skill-icon icon-postgresql",
    category: "database",
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

  /* "Card terbuka" diturunkan dari visibilitas section, bukan di-reset lewat
   * useEffect(setState) (dilarang react-hooks/set-state-in-effect).
   * Section keluar layar -> openSkill jadi null, kartu tertutup; state asli
   * tetap disimpan dan dibersihkan saat user mengklik lagi. */
  const openSkill = isVisible ? activeSkill : null;

  const getAnimationClass = () => {
    if (!isVisible) return "";
    return direction === "down" ? "active active-down" : "active active-up";
  };

  const handleCardClick = (name: string) => {
    if (openSkill === name) {
      setActiveSkill(null);
      return;
    }

    if (openSkill !== null) {
      setActiveSkill(null);
      setTimeout(() => {
        setActiveSkill(name);
      }, 500);
    } else {
      setActiveSkill(name);
    }
  };

  const activeIndex = skillsData.findIndex((s) => s.name === openSkill);

  /* Jumlah kolom grid saat ini dari class Bootstrap yang berlaku
   * (col-6 / col-md-4 / col-lg-3). Dulu hardcoded Math.floor(index / 4):
   * benar hanya di desktop, salah total di HP (2 kolom) sehingga
   * "sibling shrink" mengenai baris yang salah.
   * useSyncExternalStore: sinkron tepat saat breakpoint berubah, tanpa
   * setState synchronously di dalam effect. */
  const columns = useSyncExternalStore(
    (cb) => {
      const md = window.matchMedia("(min-width: 768px)");
      const lg = window.matchMedia("(min-width: 992px)");
      md.addEventListener("change", cb);
      lg.addEventListener("change", cb);
      return () => {
        md.removeEventListener("change", cb);
        lg.removeEventListener("change", cb);
      };
    },
    () => {
      const w = window.innerWidth;
      return w >= 992 ? 4 : w >= 768 ? 3 : 2;
    },
    () => 4,
  );

  const activeRow = activeIndex !== -1 ? Math.floor(activeIndex / columns) : -1;

  const getColClass = (index: number) => {
    if (activeRow === -1) {
      return "col-6 col-md-4 col-lg-3";
    }

    const currentRow = Math.floor(index / columns);

    if (currentRow === activeRow) {
      if (index === activeIndex) {
        return "col-12 col-md-6 col-lg-6 active-expanded";
      } else {
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
            const isFlipped = skill.name === openSkill;
            const skillDesc = skill.desc[lang];

            return (
              <div
                className={`grid-col-transition ${getColClass(index)}`}
                key={skill.name}
              >
                <button
                  type="button"
                  className="skill-card-wrapper"
                  aria-expanded={isFlipped}
                  aria-label={`${skill.name} — ${t.flipHint}`}
                  onClick={() => handleCardClick(skill.name)}
                  style={{ "--delay": index } as React.CSSProperties}
                >
                  <div
                    className={`skill-card-inner ${isFlipped && isVisible ? "is-flipped" : ""}`}
                  >
                    {/* SISI DEPAN CARD */}
                    <div className="skill-card skill-card-front text-center p-3 d-flex flex-column align-items-center justify-content-center">
                      <i
                        className={`${skill.iconClass} display-4 mb-2`}
                        aria-hidden="true"
                      ></i>
                      <h5 className="m-0 fw-semibold">{skill.name}</h5>
                      <span className="skill-category-chip">
                        {CATEGORY_LABEL[skill.category][lang]}
                      </span>
                      <span className="skill-flip-hint" aria-hidden="true">
                        +
                      </span>
                    </div>

                    {/* SISI BELAKANG CARD */}
                    <div className="skill-card skill-card-back p-3 d-flex align-items-center gap-3 text-start">
                      <i
                        className={`${skill.iconClass} skill-icon-back flex-shrink-0`}
                        aria-hidden="true"
                      ></i>
                      <div className="skill-info-content">
                        <h5 className="fw-bold mb-1 text-uppercase">
                          {skill.name}
                        </h5>
                        <p className="skill-desc-text m-0">{skillDesc}</p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}