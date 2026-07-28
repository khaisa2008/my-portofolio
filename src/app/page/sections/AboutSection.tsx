"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/app/functions/UseIntersectionObserver";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface Star {
  x: string;
  y: string;
  delay: string;
  duration: string;
  size: string;
}

const content = {
  ID: {
    title: "Tentang Saya",
    subtitle: "Mengenal saya lebih dekat",
    whoAmITitle: "Siapa Saya?",
    whoAmIDesc:
      "Saya adalah seorang web developer yang bersemangat dalam membuat situs web yang elegan dan interaktif. Saya senang membangun aplikasi modern menggunakan React, Next.js, Bootstrap, dan Laravel.",
    visionTitle: "Visi & Nilai",
    visionDesc:
      "Tujuan saya adalah membangun pengalaman digital yang berdampak dengan kode yang bersih dan desain modern. Saya berfokus pada aksesibilitas, performa, dan UI/UX yang responsif.",
    highlightTitle: "Sorotan Utama",
    highlightDesc: "3+ Tahun Pengalaman dalam Pengembangan Web",
    expTitle: "Pengalaman Kerja",
    expItem1: "Pengembang Frontend",
    expItem2: "Perancang UI/UX",
    expItem3: "Pengembang Web Freelance",
    present: "Sekarang",
  },
  EN: {
    title: "About Me",
    subtitle: "Get to know more about me",
    whoAmITitle: "Who Am I?",
    whoAmIDesc:
      "I am a passionate web developer who loves creating elegant and interactive websites. I enjoy building modern applications using React, Next.js, Bootstrap, and Laravel.",
    visionTitle: "Vision & Values",
    visionDesc:
      "My goal is to build impactful digital experiences with clean code and modern design. I focus on accessibility, performance, and responsive UI/UX.",
    highlightTitle: "Quick Highlight",
    highlightDesc: "3+ Years of Experience in Web Development",
    expTitle: "Experience",
    expItem1: "Frontend Developer",
    expItem2: "UI/UX Designer",
    expItem3: "Freelance Web Developer",
    present: "Present",
  },
};

export default function AboutSection() {
  const { lang } = useLanguage();

  const t = content[lang];

  const [stars, setStars] = useState<Star[]>([]);
  // Menggunakan custom hook observer (mendeteksi ketika section aktif / terlihat)
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>({
    threshold: 0.15,
  });

  useEffect(() => {
    const starCount = 40;
    const generatedStars = Array.from({ length: starCount }).map(() => {
      const spawnFromTop = Math.random() > 0.4;

      let x: string;
      let y: string;

      if (spawnFromTop) {
        x = `${Math.random() * 100}%`;
        y = `${Math.random() * -20}%`;
      } else {
        x = `${Math.random() * -10}%`;
        y = `${Math.random() * 80}%`;
      }

      return {
        x,
        y,
        delay: `${Math.random() * 6}s`,
        duration: `${1.8 + Math.random() * 2.2}s`,
        size: `${2 + Math.random() * 2}px`,
      };
    });

    setStars(generatedStars);
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about-section py-5 scroll-margin-top ${isVisible ? "active" : ""}`}
    >
      {/* Container Bintang Jatuh (Sesuai request: Tidak Diubah) */}
      <div className="constellation">
        {stars.map((star, i) => (
          <span
            key={i}
            className="star"
            style={
              {
                "--x": star.x,
                "--y": star.y,
                "--delay": star.delay,
                "--duration": star.duration,
                "--size": star.size,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Container Elemen Dekorasi Background */}
      <div className="bg-decorations">
        {/* Lingkaran Gradien */}
        <div className="bg-element bg-circle bg-circle-1"></div>
        <div className="bg-element bg-circle bg-circle-2"></div>
        <div className="bg-element bg-circle bg-circle-3"></div>
        <div className="bg-element bg-circle bg-circle-4"></div>
        <div className="bg-element bg-circle bg-circle-5"></div>

        {/* Ring / Cincin */}
        <div className="bg-element bg-ring bg-ring-left"></div>
        <div className="bg-element bg-ring bg-ring-right-large"></div>
        <div className="bg-element bg-ring bg-ring-right-top"></div>

        {/* Pola Titik (Dot Grid) */}
        <div className="bg-element bg-dot-grid dot-grid-top-left"></div>
        <div className="bg-element bg-dot-grid dot-grid-mid-left"></div>
        <div className="bg-element bg-dot-grid dot-grid-bottom-right"></div>

        {/* Tanda Plus */}
        <div className="bg-element bg-plus plus-1"></div>
        <div className="bg-element bg-plus plus-2"></div>
        <div className="bg-element bg-plus plus-3"></div>
        <div className="bg-element bg-plus plus-4"></div>
      </div>

      {/* Konten Utama */}
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        <div className="row g-4">
          {/* KOLOM KIRI */}
          <div className="col-lg-7 d-flex flex-column gap-4">
            {/* Card Kiri Top */}
            <div className="glass-card card-left p-4 flex-fill">
              <h3 className="mb-3">
                <i className="bi bi-person-circle"></i> {t.whoAmITitle}
              </h3>
              <p>
                {t.whoAmIDesc}
              </p>
            </div>

            {/* Card Kiri Bottom */}
            <div className="glass-card card-left p-4 flex-fill">
              <h3 className="mb-3">
                <i className="bi bi-code-slash"></i> {t.visionTitle}
              </h3>
              <p>
                {t.visionDesc}
              </p>
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="col-lg-5 d-flex flex-column gap-4">
            {/* Card Kanan Top (Pendek) */}
            <div className="glass-card card-right p-4">
              <h4 className="mb-1">
                <i className="bi bi-star-fill me-2"></i>{t.highlightTitle}
              </h4>
              <small className="">
                {t.highlightDesc}
              </small>
            </div>

            {/* Card Kanan Bottom (Tinggi / Experience) */}
            <div className="glass-card card-right p-4 flex-fill">
              <h3 className="mb-3">
                <i className="bi bi-award"></i> {t.expTitle}
              </h3>
              <div className="timeline-item">
                <h5>{t.expItem1}</h5>
                <small>2023 - {t.present}</small>
              </div>
              <div className="timeline-item mt-4">
                <h5>{t.expItem2}</h5>
                <small>2022 - 2023</small>
              </div>
              <div className="timeline-item mt-4">
                <h5>{t.expItem3}</h5>
                <small>2021 - Present</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
