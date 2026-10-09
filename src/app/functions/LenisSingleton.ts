"use client";

import Lenis from "lenis";

/* Satu-satunya instance Lenis di seluruh app.
 *
 * Sebelumnya ada DUA instance (MainPortfolio + UseNav) yang sama-sama
 * memanggil lenis.raf() di loop masing-masing dengan durasi berbeda (1.0 vs
 * 1.2). Keduanya berebut menulis posisi scroll tiap frame -> scroll
 * bolak-balik dan terbaca sebagai "bergetar" (card & police line melompat). */
let instance: Lenis | null = null;

export function getLenis(): Lenis {
  if (!instance) {
    instance = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
  }
  return instance;
}

export function destroyLenis() {
  instance?.destroy();
  instance = null;
}
