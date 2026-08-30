"use client";

import { useEffect, useRef, useState } from "react";

export default function useRobotHead() {
  const eyeLeft = useRef<HTMLDivElement>(null);
  const eyeRight = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  /* ================= BLINK STATE ================= */

  const [blinkLeft, setBlinkLeft] = useState(false);
  const [blinkRight, setBlinkRight] = useState(false);

  const [angry, setAngry] = useState(false);
  const [dizzy, setDizzy] = useState(false);

  const clickCount = useRef(0);

  const rotationCount = useRef(0);
  const lastAngle = useRef(0);
  const accumulatedRotation = useRef(0);

  /* ================= EYE FOLLOW ================= */

  useEffect(() => {
    
    let idleTimer: NodeJS.Timeout;

    const moveEyes = (x: number, y: number) => {
      if (angry || dizzy) return;

      const head = headRef.current;

      if (!head) return;

      const robotRect = head.getBoundingClientRect();

      const centerX = robotRect.left + robotRect.width / 2;

      const centerY = robotRect.top + robotRect.height / 2;

      const dx = x - centerX;
      const dy = y - centerY;

      const deadZone = 70;

      /* ================= ROTATION DETECTION ================= */

      const distance = Math.sqrt(dx * dx + dy * dy);

      /* hanya aktif di luar kepala */

      if (distance > 140 && !dizzy) {
        const angle = Math.atan2(dy, dx);

        let delta = angle - lastAngle.current;

        /* normalisasi sudut */

        if (delta > Math.PI) {
          delta -= Math.PI * 2;
        } else if (delta < -Math.PI) {
          delta += Math.PI * 2;
        }

        accumulatedRotation.current += delta;

        lastAngle.current = angle;

        /* satu putaran */

        if (Math.abs(accumulatedRotation.current) > Math.PI * 2) {
          rotationCount.current++;

          accumulatedRotation.current = 0;
        }

        /* trigger dizzy */

        if (rotationCount.current >= 5) {
          setDizzy(true);

          rotationCount.current = 0;

          setTimeout(() => {
            setDizzy(false);

            resetEyes();
          }, 5000);
        }
      }

      /* ================= EYE MOVE ================= */

      [eyeLeft.current, eyeRight.current].forEach((eye) => {
        if (!eye) return;

        const rect = eye.getBoundingClientRect();

        const eyeX = rect.left + rect.width / 2;

        const eyeY = rect.top + rect.height / 2;

        const angle = Math.atan2(y - eyeY, x - eyeX);

        const moveX = Math.cos(angle) * 8;

        const moveY = Math.sin(angle) * 8;

        eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      /* ================= HEAD MOVE ================= */

      const maxMoveX = 24;
      const maxMoveY = 18;
      const maxRotate = 12;

      /* normalisasi posisi cursor */

      const normalizedX = Math.max(-1, Math.min(1, dx / 220));

      const normalizedY = Math.max(-1, Math.min(1, dy / 220));

      /* gerakan kepala */

      const headX = normalizedX * maxMoveX;

      const headY = normalizedY * maxMoveY;

      const rotate = normalizedX * maxRotate;

      /* dead zone */

      if (Math.abs(dx) < deadZone && Math.abs(dy) < deadZone) {
        head.style.transform = `
        translate(0px, 0px)
        rotate(0deg)
      `;

        clearTimeout(idleTimer);

        idleTimer = setTimeout(() => {
          resetEyes();
        }, 4000);

        return;
      }

      /* apply transform */

      head.style.transform = `
        translate(${headX}px, ${headY}px)
        rotate(${rotate}deg)
      `;

      /* ================= EXTRA SLIDE EFFECT ================= */

      // const skewX = normalizedX * -4;
      // const skewY = normalizedY * -2;

      // const extraSlideX = normalizedX * 6;

      // /* ================= APPLY TRANSFORM ================= */

      // head.style.transform = `
      //   translate(${headX + extraSlideX}px, ${headY}px)
      //   rotate(${rotate}deg)
      //   skew(${skewX}deg, ${skewY}deg)
      // `;

      /* ================= RESET TIMER ================= */

      clearTimeout(idleTimer);

      idleTimer = setTimeout(() => {
        resetEyes();
      }, 4000);
    };

    /* ================= RESET EYES ================= */

    const resetEyes = () => {
      [eyeLeft.current, eyeRight.current].forEach((eye) => {
        if (!eye) return;

        eye.style.transform = `translate(0px, 0px)`;
      });

      if (headRef.current) {
        headRef.current.style.transform = `
            translate(0px, 0px)
            rotate(0deg)
          `;
      }
    };

    /* ================= DESKTOP ================= */

    const handleMouseMove = (e: MouseEvent) => {
      moveEyes(e.clientX, e.clientY);
    };

    /* ================= MOBILE ================= */

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];

      moveEyes(touch.clientX, touch.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];

      moveEyes(touch.clientX, touch.clientY);
    };

    /* ================= EVENTS ================= */

    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("touchmove", handleTouchMove);

    window.addEventListener("touchstart", handleTouchStart);

    /* ================= CLEANUP ================= */

    return () => {
      clearTimeout(idleTimer);

      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("touchmove", handleTouchMove);

      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [angry, dizzy]);

  /* ================= DIZZY RESET ================= */

  useEffect(() => {
    if (!dizzy) return;

    [eyeLeft.current, eyeRight.current].forEach((eye) => {
      if (!eye) return;

      eye.style.transform = `translate(0px, 0px)`;
    });

    if (headRef.current) {
      headRef.current.style.transform = `
          translate(0px, 0px)
          rotate(0deg)
        `;
    }
  }, [dizzy]);

  /* ================= AUTO BLINK ================= */

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkLeft(true);
      setBlinkRight(true);

      setTimeout(() => {
        setBlinkLeft(false);
        setBlinkRight(false);
      }, 180);
    }, 5000);

    return () => clearInterval(blinkInterval);
  }, []);

  /* ================= EYE CLICK ================= */

  const handleLeftEyeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setBlinkLeft(true);

    setTimeout(() => {
      setBlinkLeft(false);
    }, 1000);
  };

  const handleRightEyeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setBlinkRight(true);

    setTimeout(() => {
      setBlinkRight(false);
    }, 1000);
  };

  /* ================= ANGRY MODE ================= */

  const handleHeadClick = () => {
    clickCount.current++;

    if (clickCount.current >= 6) {
      setAngry(true);

      setTimeout(() => {
        setAngry(false);

        clickCount.current = 0;
      }, 3000);
    }

    setTimeout(() => {
      if (clickCount.current > 0) {
        clickCount.current--;
      }
    }, 1000);
  };

  return {
    eyeLeft,
    eyeRight,
    headRef,

    blinkLeft,
    blinkRight,

    angry,
    dizzy,

    handleLeftEyeClick,
    handleRightEyeClick,
    handleHeadClick,
  };
}
