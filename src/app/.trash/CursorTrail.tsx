"use client";

import { useEffect, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
};

export default function CursorTrail() {
  const [points, setPoints] = useState<Point[]>([]);
  const [auroraColor, setAuroraColor] =
    useState("hsl(0,100%,60%)");

  const animationRef = useRef<number | null>(
    null
  );

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    const trail: Point[] = [];

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener(
      "mousemove",
      handleMove
    );

    let lastX = 0;
    let lastY = 0;

    const animate = () => {
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;

      const distance = Math.sqrt(
        dx * dx + dy * dy
      );

      if (distance > 1) {
        trail.unshift({
          x: mouseX,
          y: mouseY,
        });

        lastX = mouseX;
        lastY = mouseY;
      }

      if (trail.length > 35) {
        trail.pop();
      }

      for (
        let i = 1;
        i < trail.length;
        i++
      ) {
        trail[i].x +=
          (trail[i - 1].x -
            trail[i].x) *
          0.18;

        trail[i].y +=
          (trail[i - 1].y -
            trail[i].y) *
          0.18;
      }

      setPoints([...trail]);

      animationRef.current =
        requestAnimationFrame(
          animate
        );
    };

    animate();

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMove
      );

      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, []);

  useEffect(() => {
    let frame: number;

    const animateColor = () => {
      const time =
        performance.now() *
        0.00004;

      const hue =
        (time * 3600) % 360;

      setAuroraColor(
        `hsl(${hue},100%,60%)`
      );

      frame =
        requestAnimationFrame(
          animateColor
        );
    };

    animateColor();

    return () =>
      cancelAnimationFrame(frame);
  }, []);

  let path = "";

  const uniquePoints =
    points.filter(
      (p, i, arr) =>
        i === 0 ||
        Math.hypot(
          p.x -
            arr[i - 1].x,
          p.y -
            arr[i - 1].y
        ) > 0.5
    );

  if (
    uniquePoints.length > 1
  ) {
    path = `M ${uniquePoints[0].x} ${uniquePoints[0].y}`;

    for (
      let i = 1;
      i <
      uniquePoints.length - 1;
      i++
    ) {
      const xc =
        (uniquePoints[i].x +
          uniquePoints[i + 1]
            .x) /
        2;

      const yc =
        (uniquePoints[i].y +
          uniquePoints[i + 1]
            .y) /
        2;

      path += ` Q
        ${uniquePoints[i].x}
        ${uniquePoints[i].y}
        ${xc}
        ${yc}`;
    }
  }

  const [
    viewport,
    setViewport,
  ] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      setViewport({
        width:
          window.innerWidth,
        height:
          window.innerHeight,
      });
    };

    updateSize();

    window.addEventListener(
      "resize",
      updateSize
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateSize
      );
    };
  }, []);

  return (
    <svg className="cursor-trail">
      <defs>
        <filter
          id="aurora-glow"
          filterUnits="userSpaceOnUse"
          x={-viewport.width}
          y={-viewport.height}
          width={
            viewport.width * 3
          }
          height={
            viewport.height * 3
          }
        >
          <feGaussianBlur
            stdDeviation="25"
            result="coloredBlur"
          />

          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Glow */}
      <path
        d={path}
        stroke={auroraColor}
        strokeWidth="36"
        fill="none"
        strokeLinecap="round"
        opacity="0.08"
        filter="url(#aurora-glow)"
      />

      {/* Mid Glow */}
      <path
        d={path}
        stroke={auroraColor}
        strokeWidth="24"
        fill="none"
        strokeLinecap="round"
        opacity="0.18"
        filter="url(#aurora-glow)"
      />

      {/* Main Trail */}
      <path
        d={path}
        stroke={auroraColor}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Bright Layer */}
      <path
        d={path}
        stroke={auroraColor}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Core */}
      <path
        d={path}
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />

      {points.length > 0 && (
        <>
          <circle
            cx={points[0].x}
            cy={points[0].y}
            r="24"
            fill={auroraColor}
            opacity="0.2"
            filter="url(#aurora-glow)"
          />

          <circle
            cx={points[0].x}
            cy={points[0].y}
            r="12"
            fill={auroraColor}
          />

          <circle
            cx={points[0].x}
            cy={points[0].y}
            r="4"
            fill="#ffffff"
          />
        </>
      )}
    </svg>
  );
}