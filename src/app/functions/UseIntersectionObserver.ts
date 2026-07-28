'use client';
import { useState, useEffect, useRef } from 'react';

interface IntersectionOptions {
  threshold?: number;
  rootMargin?: string;
}

// Tambahkan Generic <T extends HTMLElement> agar cocok untuk <section>, <div>, <header>, dll.
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>({ 
  threshold = 0.2, 
  rootMargin = '0px' 
}: IntersectionOptions = {}) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    const currentRef = targetRef.current;
    if (!currentRef) return; // Guard clause jika ref belum nempel ke DOM

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [threshold, rootMargin]);

  return [targetRef, isVisible] as const;
}