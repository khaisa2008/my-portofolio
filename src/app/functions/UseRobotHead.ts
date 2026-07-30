"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function useRobotHead() {
  const eyeLeft = useRef<HTMLDivElement>(null);
  const eyeRight = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  const [blinkLeft, setBlinkLeft] = useState(false);
  const [blinkRight, setBlinkRight] = useState(false);

  const [angry, setAngry] = useState(false);
  const [dizzy, setDizzy] = useState(false);

  const clickCount = useRef(0);
  const rotationCount = useRef(0);
  const lastAngle = useRef(0);
  const accumulatedRotation = useRef(0);

  // Ref untuk kontrol animasi
  const animationRef = useRef<number | null>(null);
  const isActiveRef = useRef(true);
  const lastFrameTimeRef = useRef<number>(0);
  const frameInterval = 1000 / 30; // Target 30fps

  // Ref untuk throttle
  const lastMoveTimeRef = useRef<number>(0);
  const moveThrottle = 1000 / 30; // 30fps untuk move events

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

  /* ================= ANGRY MODE ================= */

  const handleHeadClick = useCallback(() => {
    // CEGAH: Jika dizzy sedang berjalan, angry tidak boleh berjalan
    if (dizzy) return;

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
  }, [dizzy]);

  /* ================= EYE FOLLOW ================= */

  // Reset eyes dengan useCallback untuk menghindari recreating
  const resetEyes = useCallback(() => {
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
  }, []);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let moveTimeout: NodeJS.Timeout | null = null;

    const moveEyes = (x: number, y: number) => {
      // Skip jika tab tidak visible
      if (!isActiveRef.current) return;

      // CEGAH: Jika angry atau dizzy aktif, mata tidak bergerak
      if (angry || dizzy) return;

      const head = headRef.current;
      if (!head) return;

      const robotRect = head.getBoundingClientRect();
      const centerX = robotRect.left + robotRect.width / 2;
      const centerY = robotRect.top + robotRect.height / 2;

      const dx = x - centerX;
      const dy = y - centerY;

      const deadZone = 70;
      const distance = Math.sqrt(dx * dx + dy * dy);

      /* ================= ROTATION DETECTION ================= */
      // Hanya aktif di luar kepala dan tidak dalam keadaan dizzy
      if (distance > 140 && !dizzy) {
        const angle = Math.atan2(dy, dx);

        let delta = angle - lastAngle.current;

        if (delta > Math.PI) {
          delta -= Math.PI * 2;
        } else if (delta < -Math.PI) {
          delta += Math.PI * 2;
        }

        accumulatedRotation.current += delta;
        lastAngle.current = angle;

        if (Math.abs(accumulatedRotation.current) > Math.PI * 2) {
          rotationCount.current++;
          accumulatedRotation.current = 0;
        }

        // CEGAH: Jika angry sedang berjalan, dizzy tidak boleh dipicu
        if (rotationCount.current >= 5 && !angry) {
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

      const normalizedX = Math.max(-1, Math.min(1, dx / 220));
      const normalizedY = Math.max(-1, Math.min(1, dy / 220));

      const headX = normalizedX * maxMoveX;
      const headY = normalizedY * maxMoveY;
      const rotate = normalizedX * maxRotate;

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

      head.style.transform = `
        translate(${headX}px, ${headY}px)
        rotate(${rotate}deg)
      `;

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        resetEyes();
      }, 4000);
    };

    // Throttled version of moveEyes
    const throttledMoveEyes = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastMoveTimeRef.current < moveThrottle) {
        // Schedule for later jika perlu
        if (!moveTimeout) {
          moveTimeout = setTimeout(() => {
            moveTimeout = null;
            const timeSince = performance.now() - lastMoveTimeRef.current;
            if (timeSince >= moveThrottle) {
              moveEyes(x, y);
            }
          }, moveThrottle);
        }
        return;
      }
      lastMoveTimeRef.current = now;
      moveEyes(x, y);
    };

    /* ================= EVENTS ================= */
    const handleMouseMove = (e: MouseEvent) => {
      throttledMoveEyes(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      throttledMoveEyes(touch.clientX, touch.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      throttledMoveEyes(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      clearTimeout(idleTimer);
      if (moveTimeout) clearTimeout(moveTimeout);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [angry, dizzy, resetEyes]);

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
    // Only run if not dizzy or angry
    if (dizzy || angry) {
      // Reset blink state
      setBlinkLeft(false);
      setBlinkRight(false);
      return;
    }

    const blinkInterval = setInterval(() => {
      // Skip blink jika tab tidak visible
      if (!isActiveRef.current) return;

      setBlinkLeft(true);
      setBlinkRight(true);

      setTimeout(() => {
        setBlinkLeft(false);
        setBlinkRight(false);
      }, 180);
    }, 5000);

    return () => clearInterval(blinkInterval);
  }, [dizzy, angry]);

  /* ================= EYE CLICK ================= */
  const handleLeftEyeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      // CEGAH: Jika dizzy atau angry aktif, click mata tidak berfungsi
      if (dizzy || angry) return;

      setBlinkLeft(true);
      setTimeout(() => {
        setBlinkLeft(false);
      }, 1000);
    },
    [dizzy, angry],
  );

  const handleRightEyeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      // CEGAH: Jika dizzy atau angry aktif, click mata tidak berfungsi
      if (dizzy || angry) return;

      setBlinkRight(true);
      setTimeout(() => {
        setBlinkRight(false);
      }, 1000);
    },
    [dizzy, angry],
  );

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
