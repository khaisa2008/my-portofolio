"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { projectsData } from "@/app/data/projectsData";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function ProjectDetailPage() {
  const params = useParams();
  const { lang } = useLanguage();
  const currentLang = lang === "ID" ? "ID" : "EN";

  const project = projectsData.find((item) => item.slug === params.slug);

  // State untuk thumbnail galeri utama
  const [selectedImage, setSelectedImage] = useState(project?.image || "");

  if (!project) {
    return (
      <div className="container py-5 text-center text-white">
        <h2>Project Not Found</h2>
        <Link href="/#projects" className="btn btn-primary mt-3">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5 text-white" style={{ maxWidth: "1000px" }}>
      {/* Tombol Back */}
      <Link
        href="/#projects"
        className="d-inline-flex align-items-center gap-2 text-info text-decoration-none mb-4"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Projects
      </Link>

      {/* Hero Showcase Card */}
      <div className="p-4 rounded-4 border border-secondary bg-dark bg-opacity-50 mb-4">
        <div className="row g-4 align-items-center">
          <div className="col-lg-7">
            {/* Image Preview Utama */}
            <div className="rounded-3 overflow-hidden bg-secondary bg-opacity-25 mb-3" style={{ height: "320px" }}>
              <img
                src={selectedImage || project.image}
                alt={project.title[currentLang]}
                className="w-100 h-100 object-fit-cover"
              />
            </div>
            {/* Thumbnail Gallery */}
            <div className="d-flex gap-2 overflow-auto pb-2">
              {project.gallery.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgSrc)}
                  className={`btn p-0 border rounded-2 overflow-hidden ${
                    selectedImage === imgSrc ? "border-info" : "border-secondary"
                  }`}
                  style={{ width: "60px", height: "45px", flexShrink: 0 }}
                >
                  <img src={imgSrc} alt="thumb" className="w-100 h-100 object-fit-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="col-lg-5">
            <h1 className="fw-bold mb-3">{project.title[currentLang]}</h1>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {project.tags.map((tag, idx) => (
                <span key={idx} className="badge bg-info text-dark px-3 py-2 rounded-pill">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-secondary">{project.description[currentLang]}</p>
          </div>
        </div>
      </div>

      {/* Metadata Strip */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="p-3 rounded-3 border border-secondary bg-dark bg-opacity-50">
            <small className="text-secondary d-block mb-1">Category</small>
            <span className="fw-semibold">{project.category}</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 rounded-3 border border-secondary bg-dark bg-opacity-50">
            <small className="text-secondary d-block mb-1">Year</small>
            <span className="fw-semibold">{project.year}</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 rounded-3 border border-secondary bg-dark bg-opacity-50">
            <small className="text-secondary d-block mb-1">Technologies</small>
            <span className="fw-semibold">{project.tags.join(", ")}</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 rounded-3 border border-secondary bg-dark bg-opacity-50">
            <small className="text-secondary d-block mb-1">Live Demo</small>
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="text-info text-decoration-none fw-semibold d-inline-flex align-items-center gap-1"
            >
              View Project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* About Project Section */}
      <div className="p-4 rounded-4 border border-secondary bg-dark bg-opacity-50 mb-4">
        <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <span className="bg-info rounded-circle d-inline-block" style={{ width: "10px", height: "10px" }}></span>
          About Project
        </h4>
        <p className="text-secondary mb-0" style={{ lineHeight: "1.7" }}>
          {project.about[currentLang]}
        </p>
      </div>

      {/* Features & Technologies Grid */}
      <div className="row g-4 mb-5">
        {/* Key Features */}
        <div className="col-md-6">
          <div className="p-4 rounded-4 border border-secondary bg-dark bg-opacity-50 h-100">
            <h5 className="fw-bold mb-3 text-info d-flex align-items-center gap-2">
              <span>★</span> Key Features
            </h5>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              {project.features.map((feature, idx) => (
                <li key={idx} className="d-flex align-items-center gap-2 text-secondary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0dcaf0" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {feature[currentLang]}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technologies Used */}
        <div className="col-md-6">
          <div className="p-4 rounded-4 border border-secondary bg-dark bg-opacity-50 h-100">
            <h5 className="fw-bold mb-3 text-info d-flex align-items-center gap-2">
              <span>&lt;/&gt;</span> Technologies Used
            </h5>
            <div className="d-flex flex-column gap-3">
              {project.technologies.map((tech, idx) => (
                <div key={idx} className="d-flex align-items-center gap-3">
                  {tech.iconUrl && (
                    <img src={tech.iconUrl} alt={tech.name} style={{ width: "40px", height: "40px" }} />
                  )}
                  <div>
                    <h6 className="mb-0 fw-bold text-info">{tech.name}</h6>
                    <small className="text-secondary">{tech.description}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating CTA Button */}
      <div className="text-center pb-4">
        <a
          href={project.liveLink}
          target="_blank"
          rel="noreferrer"
          className="btn btn-info btn-lg rounded-pill px-5 fw-semibold d-inline-flex align-items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          Visit Live Demo
        </a>
      </div>
    </div>
  );
}