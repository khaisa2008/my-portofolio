"use client";
import { useState, useEffect, useRef } from "react";

interface IntersectionOptions {
  threshold?: number;
  rootMargin?: string;
}

export type ScrollDirection = "down" | "up" | null;

export function useIntersectionObserver<T extends HTMLElement = HTMLElement>({
  threshold = 0.2,
  rootMargin = "0px",
}: IntersectionOptions = {}) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    const currentRef = targetRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const currentDirection =
            entry.boundingClientRect.top < 0 ? "up" : "down";
          setDirection(currentDirection);
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [threshold, rootMargin]);

  return [targetRef, isVisible, direction] as const;
}
