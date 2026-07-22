"use client";

import { useEffect, useRef } from "react";

export default function GravityWell() {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    let mouseX =
      window.innerWidth / 2;

    let mouseY =
      window.innerHeight / 2;

    let active = false;

    let targetStrength = 0;
    let currentStrength = 0;

    let idleTimeout:
      | NodeJS.Timeout
      | undefined;

    const RETURN_DURATION = 1000; // 1 detik
    
    const spacing = 40;

    const gravityRadius = 300;

    const gravityStrength = 0.45;

    const hideAfterDelay =
    () => {
      clearTimeout(
        idleTimeout
      );

      idleTimeout =
        setTimeout(() => {
          targetStrength = 0;
        }, 500); // diam 0.5 detik
    };

    const activate = (
      x: number,
      y: number
    ) => {
      mouseX = x;
      mouseY = y;

      targetStrength = 1;

      hideAfterDelay();
    };

    const resize = () => {
      canvas.width =
        window.innerWidth;

      canvas.height =
        window.innerHeight;
    };

    resize();

    const handleMouseMove = (
      e: MouseEvent
    ) => {
      activate(
        e.clientX,
        e.clientY
      );
    };

    const handleTouch = (
      e: TouchEvent
    ) => {
      const touch =
        e.touches[0];

      if (!touch) return;

      activate(
        touch.clientX,
        touch.clientY
      );
    };

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "touchstart",
      handleTouch,
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      handleTouch,
      { passive: true }
    );

    const getWarpedPoint = (
      x: number,
      y: number
    ) => {
      if (currentStrength <= 0.001)
        return { x, y };

      const dx =
        mouseX - x;

      const dy =
        mouseY - y;

      const distance =
        Math.sqrt(
          dx * dx +
            dy * dy
        );

      if (
        distance >
        gravityRadius
      ) {
        return { x, y };
      }

      const force =
        (1 -
          distance /
            gravityRadius) *
        gravityStrength *
        currentStrength;

      return {
        x: x + dx * force,
        y: y + dy * force,
      };
    };

    const OVERSCAN = gravityRadius * 2;

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(0,255,255,.12)";
      ctx.lineWidth = 1;

      // Horizontal
      for (
        let y = -OVERSCAN;
        y <= canvas.height + OVERSCAN;
        y += spacing
      ) {
        ctx.beginPath();

        for (
          let x = -OVERSCAN;
          x <= canvas.width + OVERSCAN;
          x += 10
        ) {
          const p = getWarpedPoint(x, y);

          if (x === -OVERSCAN) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }

        ctx.stroke();
      }

      // Vertical
      for (
        let x = -OVERSCAN;
        x <= canvas.width + OVERSCAN;
        x += spacing
      ) {
        ctx.beginPath();

        for (
          let y = -OVERSCAN;
          y <= canvas.height + OVERSCAN;
          y += 10
        ) {
          const p = getWarpedPoint(x, y);

          if (y === -OVERSCAN) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }

        ctx.stroke();
      }
    };

    const drawGlow = () => {
      if (currentStrength <= 0.01)
        return;

      // Outer glow
      const outer =
        ctx.createRadialGradient(
          mouseX,
          mouseY,
          0,
          mouseX,
          mouseY,
          180
        );

      outer.addColorStop(
        0,
        `rgba(0,255,255,${
          0.18 * currentStrength
        })`
      );

      outer.addColorStop(
        1,
        "rgba(0,255,255,0)"
      );

      ctx.fillStyle = outer;

      ctx.beginPath();

      ctx.arc(
        mouseX,
        mouseY,
        180,
        0,
        Math.PI * 2
      );

      ctx.fill();

      // Inner glow
      const inner =
        ctx.createRadialGradient(
          mouseX,
          mouseY,
          0,
          mouseX,
          mouseY,
          80
        );

      inner.addColorStop(
        0,
        `rgba(0,255,255,${
          0.18 * currentStrength
        })`
      );

      inner.addColorStop(
        1,
        "rgba(0,255,255,0)"
      );

      ctx.fillStyle = inner;

      ctx.beginPath();

      ctx.arc(
        mouseX,
        mouseY,
        80,
        0,
        Math.PI * 2
      );

      ctx.fill();
    };


    const animate = () => {

      currentStrength +=
        (targetStrength -
          currentStrength) *
        (1 /
          (RETURN_DURATION /
            16));

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      drawGrid();

      drawGlow();

      requestAnimationFrame(
        animate
      );
    };

    animate();

    return () => {
      clearTimeout(
        idleTimeout
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "touchstart",
        handleTouch
      );

      window.removeEventListener(
        "touchmove",
        handleTouch
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="gravity-well"
    />
  );
}