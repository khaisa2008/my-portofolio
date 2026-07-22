"use client";

// import { useEffect } from "react";
import { useEffect, useState } from "react";
import RobotHead from "../components/RobotHead";
import useMethod from "../function/UseHackerText";
import useMethodNav from "../function/UseNav";

export default function Home() {
  const { displayText } = useMethod();

  const { setActive } = useMethodNav();

  return (
    <>
      {/* ================= SPLASH SCREEN ================= */}
      <div
        id="intro"
        className="intro d-flex justify-content-center align-items-center"
      >
        <div className="scanline"></div>
        <div className="text-center splash-content">
          <div className="item item1">
            {/* <div className="cube-container">
              <div className="cube">
                <div></div>
                <div></div>
              </div>
            </div> */}
            {/* <i className="bi bi-laptop" style={{ fontSize: "100px" }}></i> */}
            <RobotHead />
          </div>

          <div className="item item2 fw-bold fs-4 mt-0">
            <h1 className="hacker-text">{displayText}</h1>
          </div>

          <div className="item3 fs-3 mt-3 d-flex justify-content-center gap-3">
            <div className="social-wrapper github-wrap">
              <i className="bi bi-github icon"></i>
            </div>

            <div className="social-wrapper code-wrap">
              <i className="bi bi-code-slash icon"></i>
            </div>

            <div className="social-wrapper person-wrap">
              <i className="bi bi-person icon"></i>
            </div>

            <div className="social-wrapper linkedin-wrap">
              <i className="bi bi-linkedin icon"></i>
            </div>

            <div className="social-wrapper instagram-wrap">
              <i className="bi bi-instagram icon"></i>
            </div>

            <div className="social-wrapper discord-wrap">
              <i className="bi bi-discord icon"></i>
            </div>
          </div>
          {/* 
          <button className="enter-btn mt-3" onClick={enterPortfolio}>
            ENTER PORTFOLIO
          </button> */}

          <div className="item item4 mt-4">Designed by M Khairul Unsa</div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div id="main">
        {/* ================= NAVBAR ================= */}
        <nav className="navbar navbar-expand-lg py-4 sticky-top">
          <div className="container justify-content-center">
            <div className="rounded-pill shadow-lg px-4 py-2 nav-capsule">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#menu"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className="collapse navbar-collapse justify-content-center"
                id="menu"
              >
                <ul className="navbar-nav gap-3 fw-semibold">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      href="#home"
                      onClick={setActive}
                    >
                      <i className="bi bi-house"></i> Home
                    </a>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#about" onClick={setActive}>
                      <i className="bi bi-person"></i> About
                    </a>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#skills" onClick={setActive}>
                      <i className="bi bi-code-slash"></i> Skills
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#projects"
                      onClick={setActive}
                    >
                      <i className="bi bi-briefcase"></i> Projects
                    </a>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#contact" onClick={setActive}>
                      <i className="bi bi-envelope"></i> Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* ================= HERO ================= */}
        <section
          id="home"
          className="container hero-section d-flex align-items-center"
        >
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="badge bg-primary-color text-ligth px-3 py-2 rounded-pill">
                Available For Freelance
              </span>

              <h1 className="hero-title mt-4">
                Hi, I&apos;m <span>M Khairul Unsa</span>
              </h1>

              <h2 className="hero-subtitle">Fullstack Web Developer</h2>

              <p className="hero-text mt-4">
                I build modern, responsive and user-friendly websites with
                beautiful UI/UX experiences. Passionate about creating digital
                products that are fast, elegant, and interactive.
              </p>

              <div className="mt-4 d-flex gap-3 flex-wrap">
                <button className="btn btn-info btn-lg rounded-pill px-4">
                  <i className="bi bi-send"></i> Hire Me
                </button>

                <button className="btn btn-outline-light btn-lg rounded-pill px-4">
                  <i className="bi bi-download"></i> Download CV
                </button>
              </div>

              <div className="social-icons mt-5">
                <i className="bi bi-github"></i>
                <i className="bi bi-linkedin"></i>
                <i className="bi bi-instagram"></i>
                <i className="bi bi-discord"></i>
              </div>
            </div>

            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <img
                src="/exemple.png"
                alt="profile"
                className="img-fluid hero-img"
              />
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section id="about" className="container py-5">
          <div className="section-title text-center mb-5">
            <h2>About Me</h2>
            <p>Get to know more about me</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="glass-card p-4 h-100">
                <h3 className="mb-3">
                  <i className="bi bi-person-circle"></i> Who Am I?
                </h3>

                <p>
                  I am a passionate web developer who loves creating elegant and
                  interactive websites. I enjoy building modern applications
                  using React, Next.js, Bootstrap and Laravel.
                </p>

                <p>
                  My goal is to build impactful digital experiences with clean
                  code and modern design.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="glass-card p-4 h-100">
                <h3 className="mb-3">
                  <i className="bi bi-award"></i> Experience
                </h3>

                <div className="timeline-item">
                  <h5>Frontend Developer</h5>
                  <small>2023 - Present</small>
                </div>

                <div className="timeline-item mt-4">
                  <h5>UI/UX Designer</h5>
                  <small>2022 - 2023</small>
                </div>

                <div className="timeline-item mt-4">
                  <h5>Freelance Web Developer</h5>
                  <small>2021 - Present</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SKILLS ================= */}
        <section id="skills" className="container py-5">
          <div className="section-title text-center mb-5">
            <h2>Skills</h2>
            <p>Technologies I use</p>
          </div>

          <div className="row g-4">
            {[
              "HTML",
              "CSS",
              "Bootstrap",
              "JavaScript",
              "React",
              "Next.js",
              "Laravel",
              "MySQL",
            ].map((skill, index) => (
              <div className="col-6 col-md-3" key={index}>
                <div className="skill-card text-center p-4">
                  <i className="bi bi-code-square fs-1"></i>
                  <h5 className="mt-3">{skill}</h5>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= PROJECTS ================= */}
        <section id="projects" className="container py-5">
          <div className="section-title text-center mb-5">
            <h2>Projects</h2>
            <p>Some of my recent work</p>
          </div>

          <div className="row g-4">
            {[1, 2, 3].map((item) => (
              <div className="col-md-4" key={item}>
                <div className="project-card">
                  <img
                    src={`https://picsum.photos/500/300?random=${item}`}
                    className="img-fluid"
                    alt=""
                  />

                  <div className="p-4">
                    <h4>E-Commerce Website</h4>

                    <p>
                      Modern responsive e-commerce platform with elegant UI and
                      powerful backend.
                    </p>

                    <button className="btn btn-info rounded-pill">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section id="contact" className="container py-5 mb-5">
          <div className="section-title text-center mb-5">
            <h2>Contact Me</h2>
            <p>Let&apos;s work together</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="glass-card p-5">
                <div className="row g-4">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control custom-input"
                      placeholder="Your Email"
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      rows={5}
                      className="form-control custom-input"
                      placeholder="Your Message"
                    ></textarea>
                  </div>

                  <div className="col-12 text-center">
                    <button className="btn btn-info btn-lg rounded-pill px-5">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="text-center py-4">
          <p>© 2026 My Portfolio | Designed with Next.js & Bootstrap</p>
        </footer>
      </div>
    </>
  );
}
