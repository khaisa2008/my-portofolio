"use client";

import { useEffect, useRef } from "react";

interface OrbitIconProps {
  image: string;
  size?: number;
  radiusX?: number;
  radiusY?: number;
  startAngle?: number;
  speed?: number;
  glow?: string;
  initialDelay?: number;
}

export default function OrbitIcon({
  image,
  size = 120,
  radiusX = 280,
  radiusY = 240,
  startAngle = 0,
  speed = 0.35,
  glow = "#ff5722",
  initialDelay = 0,
}: OrbitIconProps) {
  const iconRef = useRef<HTMLImageElement>(null);
  const isVisibleRef = useRef(false);  

  // Gunakan ref untuk nilai yang sering berubah (hindari re-render)
  const angleRef = useRef(startAngle);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const frameInterval = 1000 / 30; // Target 30fps
  const isActiveRef = useRef(true);
  const BOOST_DURATION = 3500; // 3.5 detik

  // Deteksi visibilitas tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      isActiveRef.current = document.visibilityState === "visible";
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      isVisibleRef.current = true;
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  useEffect(() => {

    // Reset start time saat animasi dimulai
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      const icon = iconRef.current;
      if (!icon) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Skip jika tab tidak visible
      if (!isActiveRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Throttle ke 30fps
      if (timestamp - lastFrameTimeRef.current < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      //----------------------------------------
      // SET START TIME PERTAMA KALI
      //----------------------------------------
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      //----------------------------------------
      // HITUNG KECEPATAN BERDASARKAN WAKTU
      //----------------------------------------
      const elapsedTime = timestamp - startTimeRef.current;
      
      // Kecepatan: 36x selama 3.5 detik pertama, kemudian normal
      let currentSpeed;
      let earlySpeed = 36 ;
      if (elapsedTime < BOOST_DURATION) {
        // Fase cepat: 36x lipat
        currentSpeed = speed * earlySpeed;
      } else {
        // Fase normal
        currentSpeed = speed;
      }
      
      // Update sudut dengan kecepatan saat ini
      angleRef.current += currentSpeed;

      //----------------------------------------
      // POSISI ORBIT
      //----------------------------------------
      const rad = (angleRef.current * Math.PI) / 180;
      const wave = Math.sin(rad * 3) * 25;

      const x = Math.cos(rad) * (radiusX + wave);
      const y = Math.sin(rad) * (radiusY + wave) ;

      //----------------------------------------
      // DEPTH & VISUAL
      //----------------------------------------
      const depth = (Math.sin(rad) + 1) / 2;
      const scale = 0.85 + depth * 0.35;
      const opacity = 0.45 + depth * 0.55;
      const isBoosting = elapsedTime < BOOST_DURATION;
      const jiggle = isBoosting
        ? 0
        : Math.sin(angleRef.current * 0.2) * 6;
      const glowSize = 10 + depth * 10;

      //----------------------------------------
      // TERAPKAN TRANSFORM (optimasi: batch semua perubahan)
      //----------------------------------------
      const transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${jiggle}deg) scale(${scale})`;
      const filter = `drop-shadow(0 0 ${glowSize}px ${glow})`;
      const finalOpacity = (isVisibleRef.current ? 1 : 0) * opacity;

      // Batch updates untuk mengurangi reflow
      icon.style.transform = transform;
      icon.style.opacity = finalOpacity.toString();
      icon.style.filter = filter;
      icon.style.zIndex = `${Math.floor(depth * 100)}`;

      animationRef.current = requestAnimationFrame(animate);
    };

    // Mulai animasi dengan timestamp
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [radiusX, radiusY, speed, glow]);

  return (
    <img
      ref={iconRef}
      src={image}
      className="orbit-icon"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        opacity: 0,
        transition: 'opacity 0.8s ease',
        position: 'absolute',
        top: '50%',
        left: '50%',
        pointerEvents: 'none',
        willChange: 'transform, opacity, filter',
      }}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}