"use client";

import React from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Link from "next/link";
import { projectsData } from "@/app/data/projectsData";
import { useIntersectionObserver } from "@/app/functions/UseIntersectionObserver"; // Adjust path accordingly

const sectionTranslations = {
  ID: {
    heading: "Proyek",
    subheading: "Beberapa karya terbaru saya",
    liveDemo: "Demo Langsung",
    sourceCode: "Kode Sumber",
  },
  EN: {
    heading: "Projects",
    subheading: "Some of my recent work",
    liveDemo: "Live Demo",
    sourceCode: "Source Code",
  },
};

export default function ProjectsSection() {
  const { lang } = useLanguage();
  const t = sectionTranslations[lang] || sectionTranslations.EN;

  // Pasang Intersection Observer Hook
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>({
    threshold: 0.15,
  });

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="project-section py-5 scroll-margin-top position-relative overflow-hidden"
    >
      {/* Background Police Line Elements */}
      <div className="police-lines-container">
        {/* Line 1: Top Horizontal */}
        <div
          className={`police-line line-top slide-right ${isVisible ? "is-visible" : ""}`}
        ></div>

        {/* Line 2: Bottom Horizontal */}
        <div className="police-line-wrapper line-bottom-wrapper">
          <div
            className={`police-line line-bottom slide-left ${isVisible ? "is-visible" : ""}`}
          ></div>
        </div>

        {/* Line 3: Diagonal Top-Left */}
        <div className="police-line-wrapper diag-1-wrapper">
          <div
            className={`police-line line-diagonal slide-right ${isVisible ? "is-visible" : ""}`}
          ></div>
        </div>

        {/* Line 4: Diagonal Bottom-Left */}
        <div className="police-line-wrapper diag-2-wrapper">
          <div
            className={`police-line line-diagonal slide-left ${isVisible ? "is-visible" : ""}`}
          ></div>
        </div>
      </div>

      <div className="container position-relative z-2">
        {/* Section Title */}
        <div className="section-title text-center mb-4">
          <h2 className="fw-bold">{t.heading}</h2>
          <p className="project-description mb-0">{t.subheading}</p>
        </div>

        {/* Projects Cards */}
        <div className="row g-4">
          {projectsData.map((project) => (
            <div className="col-md-4" key={project.id}>
              <div className="project-card d-flex flex-column h-100 mx-auto">
                <div className="project-img-wrapper mb-3">
                  <img
                    src={project.image}
                    className="img-fluid"
                    alt={project.title[lang]}
                  />
                  <Link
                    href={`/projects/${project.slug}`}
                    className="arrow-btn d-flex align-items-center justify-content-center"
                    aria-label="View Project Details"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </Link>
                </div>

                <div className="d-flex flex-column flex-grow-1">
                  <div>
                    <span className="project-category-badge d-inline-block mb-3">
                      {project.category}
                    </span>

                    <h3 className="project-title mb-2">
                      {project.title[lang]}
                    </h3>
                    <p className="project-description mb-3">
                      {project.description[lang]}
                    </p>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mb-3 mt-auto">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <hr className="project-divider my-2" />

                  <div className="d-flex align-items-center justify-content-around pt-2">
                    <a
                      href={project.liveLink}
                      className="project-link d-flex align-items-center gap-2"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      <span>{t.liveDemo}</span>
                    </a>

                    <div className="link-separator"></div>

                    <a
                      href={project.githubLink}
                      className="project-link d-flex align-items-center gap-2"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      <span>{t.sourceCode}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
