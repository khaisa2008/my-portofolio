"use client";

export default function UseParticle() {
  // Variabel untuk kontrol animasi
  let animationId: number;
  let isActive = true;
  let lastFrameTime = 0;
  const frameInterval = 1000 / 30; // Target 30fps

  // Deteksi visibilitas tab
  if (typeof document !== 'undefined') {
    document.addEventListener("visibilitychange", () => {
      isActive = document.visibilityState === "visible";
    });
  }

  function initParticles() {
    const canvas = document.getElementById(
      "particleCanvas"
    ) as HTMLCanvasElement;

    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    
    if (!ctx) return;

    let particles: {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
    }[] = [];

    // Cache untuk menghindari alokasi berulang
    let maxDistance = 0;
    let particleCount = 0;

    function createParticles() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Kurangi density untuk performa
      const density = 0.00005; // Turun dari 0.00006

      particleCount = Math.min(
        Math.floor(
          canvas.width *
            canvas.height *
            density
        ),
        200 // Turun dari 250
      );

      particles = Array.from(
        { length: particleCount },
        () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.8 + 0.8, // Sedikit lebih kecil
          vx: (Math.random() - 0.5) * 0.35, // Sedikit lebih lambat
          vy: (Math.random() - 0.5) * 0.35,
          opacity: Math.random() * 0.5 + 0.3, // Turun opacity
        })
      );

      maxDistance = Math.min(
        canvas.width * 0.05, // Turun dari 0.06
        100 // Turun dari 120
      );
    }

    createParticles();

    function animate(timestamp: number) {
      // Stop jika tab tidak visible
      if (!isActive) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Throttle ke 30fps
      if (timestamp - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = timestamp;

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Matikan shadow untuk performa lebih baik
      // (tetap pertahankan jika ingin efek glow)
      ctx.shadowBlur = 10; // Turun dari 15
      ctx.shadowColor = "#00ffff";

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
        ctx.arc(
          p.x,
          p.y,
          p.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(
          0,
          255,
          255,
          ${p.opacity}
        )`;

        ctx.fill();
      }

      // Reset shadow untuk lines
      ctx.shadowBlur = 0;

      // Optimasi: batasi jumlah partikel untuk koneksi
      const connectionLimit = Math.min(len, 150);

      // Gunakan squared distance untuk menghindari sqrt
      const maxDistSq = maxDistance * maxDistance;

      for (
        let i = 0;
        i < connectionLimit;
        i++
      ) {
        for (
          let j = i + 1;
          j < connectionLimit;
          j++
        ) {
          const dx =
            particles[i].x -
            particles[j].x;

          const dy =
            particles[i].y -
            particles[j].y;

          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);

            ctx.beginPath();

            ctx.moveTo(
              particles[i].x,
              particles[i].y
            );

            ctx.lineTo(
              particles[j].x,
              particles[j].y
            );

            ctx.strokeStyle = `rgba(
              0,
              255,
              255,
              ${
                0.12 * // Turun dari 0.15
                (1 -
                  dist /
                    maxDistance)
              }
            )`;

            ctx.stroke();
          }
        }
      }

      animationId =
        requestAnimationFrame(
          animate
        );
    }

    animate(0);

    const resize = () => {
      createParticles();
    };

    window.addEventListener(
      "resize",
      resize
    );

    return () => {
      cancelAnimationFrame(
        animationId
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }

  return {
    initParticles,
  };
}