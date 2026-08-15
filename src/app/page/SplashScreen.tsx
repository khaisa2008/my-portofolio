"use client";

import RobotHead from "@/app/components/RobotHead";
import useMethod from "@/app/functions/UseHackerText";
import CursorTrail from "@/app/#trash/CursorTrail";
import GravityWell from "@/app/components/GravityWell";
import UseParticle from "@/app/functions/UseParticle";
import "@/app/animation/splash.css";

import { useEffect, useState } from "react";

type Props = {
  setShowMain: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SplashScreen({ setShowMain }: Props) {
  const { displayText, finished } = useMethod();

  const [canEnter, setCanEnter] = useState(false);
  
  // 1. Tambahkan state isAngry khusus di SplashScreen
  const [isAngry, setIsAngry] = useState(false);

  const { initParticles } = UseParticle();

  useEffect(() => {
    const cleanup = initParticles();

    return () => {
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanEnter(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // 2. Deteksi perubahan class pada robot-head tanpa merubah file RobotHead
  useEffect(() => {
    const robotHeadEl = document.querySelector(".robot-head");
    if (!robotHeadEl) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const currentClasses = robotHeadEl.className;
          const angryActive = currentClasses.includes("angry-head") || currentClasses.includes("robot-angry");
          setIsAngry(angryActive);
        }
      });
    });

    observer.observe(robotHeadEl, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const enterPortfolio = () => {
    if (!canEnter) return;

    // animasi zoom content
    document.querySelector(".splash-content")?.classList.add("zoom-out");

    // fade seluruh splash
    setTimeout(() => {
      const splash = document.getElementById("intro");

      splash?.classList.add("fade-out");
    }, 800);

    // tampilkan main page
    setTimeout(() => {
      setShowMain(true);
    }, 1500);
  };

  return (
    <>
      <div
        id="intro"
        className="intro d-flex justify-content-center align-items-center"
      >
        <canvas className="particle-canvas" id="particleCanvas"></canvas>
        <div className="vignette"></div>

        <GravityWell />
        {/* <CursorTrail /> */}
        <div className="scanline"></div>

        <div className="text-center splash-content">
          <div className="item item1">
            <RobotHead />
          </div>

          <div className="item item2 fw-bold fs-4 mt-0">
            {/* Pakai ${isAngry ? "..." : ""} di sini */}
            <h1 className={`hacker-text ${finished ? "finished" : ""} ${isAngry ? "text-angry" : ""}`}>
              {displayText}
            </h1>
          </div>

          <div className="item3 fs-3 mt-3 d-flex justify-content-center gap-3">
            <div className={`social-wrapper github-wrap`}>
              <i className={`bi bi-github icon ${isAngry ? "icon-angry" : ""}`}></i>
            </div>

            <div className={`social-wrapper code-wrap`}>
              <i className={`bi bi-code-slash icon ${isAngry ? "icon-angry" : ""}`}></i>
            </div>

            <div className={`social-wrapper person-wrap`}>
              <i className={`bi bi-person icon ${isAngry ? "icon-angry" : ""}`}></i>
            </div>

            <div className={`social-wrapper linkedin-wrap`}>
              <i className={`bi bi-linkedin icon ${isAngry ? "icon-angry" : ""}`}></i>
            </div>

            <div className={`social-wrapper instagram-wrap`}>
              <i className={`bi bi-instagram icon ${isAngry ? "icon-angry" : ""}`}></i>
            </div>

            <div className={`social-wrapper discord-wrap`}>
              <i className={`bi bi-discord icon ${isAngry ? "icon-angry" : ""}`}></i>
            </div>
          </div>

          <button
            className={`enter-btn mt-3 ${isAngry ? "btn-angry" : ""}`}
            onClick={enterPortfolio}
            disabled={!canEnter}
          >
            ENTER PORTFOLIO
          </button>

          <div className={`item item4 mt-4 under-text ${isAngry ? "text-angry-subtle" : ""}`}>
            Designed by M Khairul Unsa
          </div>
        </div>
      </div>
    </>
  );
}