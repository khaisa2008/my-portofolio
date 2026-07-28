"use client";

import RobotHead from "../components/RobotHead";
import useMethod from "../functions/UseHackerText";
import CursorTrail from "../#trash/CursorTrail";
import GravityWell from "../components/GravityWell";
import UseParticle from "../functions/UseParticle";
import { useEffect, useState } from "react";

type Props = {
  setShowMain: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SplashScreen({ setShowMain }: Props) {
  const { displayText, finished } = useMethod();

  const [canEnter, setCanEnter] = useState(false);

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
            <h1 className={`hacker-text ${finished ? "finished" : ""}`}>
              {displayText}
            </h1>
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

          <button
            className="enter-btn mt-3"
            onClick={enterPortfolio}
            disabled={!canEnter}
          >
            ENTER PORTFOLIO
          </button>

          <div className="item item4 mt-4">Designed by M Khairul Unsa</div>
        </div>
      </div>
    </>
  );
}
