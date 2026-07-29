"use client";

import { useTheme } from "@/app/contexts/ThemeContext"; // Adjust path if needed

export default function UseParticle() {
  const { dark } = useTheme(); // Take dark mode state

  let animationId: number;
  let isActive = true;
  let lastFrameTime = 0;
  const frameInterval = 1000 / 30;

  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      isActive = document.visibilityState === "visible";
    });
  }

  function initParticles() {
    const canvas = document.getElementById(
      "particleCanvas",
    ) as HTMLCanvasElement;

    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    // Direct RGB values based on current theme state
    const colorRGB = dark ? "0, 255, 255" : "51, 65, 85"; // Cyan vs Slate Dark
    const shadowColorHex = dark ? "#00ffff" : "rgba(51, 65, 85, 0.4)";

    let particles: {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
    }[] = [];

    let maxDistance = 0;
    let particleCount = 0;

    function createParticles() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const density = 0.00005;

      particleCount = Math.min(
        Math.floor(canvas.width * canvas.height * density),
        200,
      );

      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.5 + 0.3,
      }));

      maxDistance = Math.min(canvas.width * 0.05, 100);
    }

    createParticles();

    function animate(timestamp: number) {
      if (!isActive) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      if (timestamp - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.shadowBlur = dark ? 10 : 0; // Glow only in dark mode
      ctx.shadowColor = shadowColorHex;

      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // Dynamic particle fill color
        ctx.fillStyle = `rgba(${colorRGB}, ${p.opacity})`;

        ctx.fill();
      }

      ctx.shadowBlur = 0;

      const connectionLimit = Math.min(len, 150);
      const maxDistSq = maxDistance * maxDistance;

      for (let i = 0; i < connectionLimit; i++) {
        for (let j = i + 1; j < connectionLimit; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            // Dynamic line color
            ctx.strokeStyle = `rgba(${colorRGB}, ${
              0.5 * (1 - dist / maxDistance)
            })`;

            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    animate(0);

    const resize = () => {
      createParticles();
    };

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }

  return {
    initParticles,
  };
}
