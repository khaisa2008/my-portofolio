"use client";

import { useTheme } from "@/app/contexts/ThemeContext";

export default function UseParticle() {
  const { dark } = useTheme();

  function initParticles() {
    const canvas = document.getElementById(
      "particleCanvas",
    ) as HTMLCanvasElement;

    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    // Scope-local variables agar terisolasi penuh
    let animationId: number;
    let isRunning = true;
    let isActive = true;
    let lastFrameTime = 0;
    const frameInterval = 1000 / 30; // Target 30fps

    const colorRGB = dark ? "0, 255, 255" : "14, 116, 144";
    const lineOpacityFactor = dark ? 0.5 : 0.65;

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

    // Listener visibilitas tab
    const handleVisibility = () => {
      isActive = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibility);

    function createParticles() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Batasi jumlah partikel agar tidak membebankan perangkat mobile
      const isMobile = window.innerWidth <= 768;
      const density = isMobile ? 0.00003 : 0.000045;
      const maxLimit = isMobile ? 60 : 130;

      particleCount = Math.min(
        Math.floor(canvas.width * canvas.height * density),
        maxLimit,
      );

      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 2.0,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        opacity: dark ? Math.random() * 0.5 + 0.3 : Math.random() * 0.4 + 0.5,
      }));

      maxDistance = Math.min(canvas.width * 0.05, 90);
    }

    createParticles();

    function animate(timestamp: number) {
      // STOP MUTLAK: langsung hentikan jika unmounted
      if (!isRunning) return;

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

      // Render Titik Partikel
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
        ctx.fillStyle = `rgba(${colorRGB}, ${p.opacity})`;
        ctx.fill();
      }

      // Render Garis Penghubung (Kalkulasi Tanpa Math.sqrt)
      const connectionLimit =
        window.innerWidth <= 768 ? Math.min(len, 70) : Math.min(len, 150);
      const maxDistSq = maxDistance * maxDistance;

      for (let i = 0; i < connectionLimit; i++) {
        for (let j = i + 1; j < connectionLimit; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            // Estimasi rasio jarak berbasis kuadrat (menghindari CPU-heavy Math.sqrt)
            const ratio = 1 - distSq / maxDistSq;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${colorRGB}, ${lineOpacityFactor * ratio})`;
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

    // CLEANUP FUNCTION
    return () => {
      isRunning = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }

  return {
    initParticles,
  };
}
