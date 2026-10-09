"use client";

import { useTheme } from "@/app/contexts/ThemeContext";
import { getBrowserZoom } from "@/app/functions/BrowserZoom";

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

    /* Kurangi ~500 draw call/frame jadi ~16: setiap warna di-bucket jadi
     * 8 level alpha, lalu satu beginPath+stroke/fill per bucket
     * (path kumulatif). Visual nyaris identik, GPU/CPU jauh lebih ringan. */
    const ALPHA_BUCKETS = 8;

    // Listener visibilitas tab
    const handleVisibility = () => {
      isActive = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Skala kompensasi zoom: radius/kecepatan/jarak partikel (dalam satuan
    // CSS pixel) dikalikan 1/z supaya ukuran visualnya di layar tetap konstan
    // berapa pun zoom browser. Deteksinya dipakai bersama dengan UseZoomLock.
    const getZoomScale = () => {
      const currentZoom = getBrowserZoom();
      return currentZoom !== 1 ? 1 / currentZoom : 1;
    };

    function createParticles() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Konversi ukuran saat ini (nilai zoom berubah memicu event resize)
      const zoomScale = getZoomScale();

      // Desktop boleh jauh lebih padat (jaringan rasi bintang yang ramai), mobile
      // justru dikurangi supaya tidak berat di CPU/GPU perangkat.
      const isMobile = window.innerWidth <= 768;
      const density = isMobile ? 0.000018 : 0.000085;
      const maxLimit = isMobile ? 45 : 220;

      particleCount = Math.min(
        Math.floor(canvas.width * canvas.height * density),
        maxLimit,
      );

      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: (Math.random() * 1.5 + 2.0) * zoomScale,
        vx: (Math.random() - 0.5) * 0.35 * zoomScale,
        vy: (Math.random() - 0.5) * 0.35 * zoomScale,
        opacity: dark ? Math.random() * 0.5 + 0.3 : Math.random() * 0.4 + 0.5,
      }));

      // Jangkauan koneksi lebih luas di desktop supaya lebih banyak titik yang
      // saling menyambung; mobile tetap rapat supaya murah digambar.
      maxDistance = (isMobile ? Math.min(canvas.width * 0.04, 70) : Math.min(canvas.width * 0.06, 120)) * zoomScale;
    }

    createParticles();

    /* Frame statis: dipakai saat prefers-reduced-motion (tanpa animasi) dan
     * saat render pertama sebelum rAF pertama berjalan. */
    function renderStatic() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dotPaths: Path2D[] = Array.from(
        { length: ALPHA_BUCKETS },
        () => new Path2D(),
      );
      for (const p of particles) {
        const idx = Math.min(
          ALPHA_BUCKETS - 1,
          Math.floor(p.opacity * ALPHA_BUCKETS),
        );
        const path = dotPaths[idx];
        path.moveTo(p.x + p.radius, p.y);
        path.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      }
      dotPaths.forEach((path, idx) => {
        const alpha = (idx + 0.5) / ALPHA_BUCKETS;
        ctx.fillStyle = `rgba(${colorRGB}, ${alpha})`;
        ctx.fill(path);
      });

      drawLines();
    }

    function drawLines() {
      const len = particles.length;
      const connectionLimit = window.innerWidth <= 768 ? Math.min(len, 50) : Math.min(len, 220);
      const maxDistSq = maxDistance * maxDistance;

      const linePaths: Path2D[] = Array.from(
        { length: ALPHA_BUCKETS },
        () => new Path2D(),
      );

      for (let i = 0; i < connectionLimit; i++) {
        for (let j = i + 1; j < connectionLimit; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            // Estimasi rasio jarak berbasis kuadrat (menghindari CPU-heavy Math.sqrt)
            const ratio = 1 - distSq / maxDistSq;
            const idx = Math.min(
              ALPHA_BUCKETS - 1,
              Math.floor(ratio * ALPHA_BUCKETS),
            );
            const path = linePaths[idx];
            path.moveTo(particles[i].x, particles[i].y);
            path.lineTo(particles[j].x, particles[j].y);
          }
        }
      }

      linePaths.forEach((path, idx) => {
        const alpha =
          (lineOpacityFactor * (idx + 0.5)) / ALPHA_BUCKETS;
        ctx.strokeStyle = `rgba(${colorRGB}, ${alpha})`;
        ctx.stroke(path);
      });
    }

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

      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      // Titik: satu fill per bucket alpha
      const dotPaths: Path2D[] = Array.from(
        { length: ALPHA_BUCKETS },
        () => new Path2D(),
      );
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        const idx = Math.min(
          ALPHA_BUCKETS - 1,
          Math.floor(p.opacity * ALPHA_BUCKETS),
        );
        const path = dotPaths[idx];
        path.moveTo(p.x + p.radius, p.y);
        path.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      }
      dotPaths.forEach((path, idx) => {
        const alpha = (idx + 0.5) / ALPHA_BUCKETS;
        ctx.fillStyle = `rgba(${colorRGB}, ${alpha})`;
        ctx.fill(path);
      });

      // Garis: satu stroke per bucket alpha
      drawLines();

      animationId = requestAnimationFrame(animate);
    }

    /* prefers-reduced-motion: gambar SATU frame statis, tanpa rAF loop. */
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (prefersReduced.matches) {
      renderStatic();
      return () => {
        isRunning = false;
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }

    animate(0);

    const resize = () => {
      createParticles();
      if (prefersReduced.matches) renderStatic();
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
