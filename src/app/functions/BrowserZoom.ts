"use client";

/* Deteksi zoom browser (Ctrl/Cmd + -) yang benar-benar bekerja.
 *
 * visualViewport.scale TIDAK berubah saat browser zoom di desktop (scale itu
 * hanya berubah saat pinch), sehingga deteksi lama selalu menghasilkan 1 dan
 * kompensasi zoom lock tidak pernah jalan. Yang benar-benar berubah saat
 * browser zoom:
 *   1. devicePixelRatio  -> sumber utama,
 *   2. rasio outerWidth / innerWidth -> hanya dipakai KALAU halaman sudah
 *      ter-zoom saat pertama dibuka (mis. browser mengingat zoom 25%). */

let baseDpr = 0;

function widthZoomRatio(): number {
  if (!window.outerWidth || !window.innerWidth) return 1;
  const ratio = window.outerWidth / window.innerWidth;
  return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
}

function calibrate() {
  const dpr = window.devicePixelRatio || 1;
  const ratio = widthZoomRatio();

  /* Hanya ratio < 1 (indikasi zoom-out) yang dipakai untuk kalibrasi baseline.
   * ratio > 1 hampir selalu berarti side panel / DevTools terbuka (innerWidth
   * menyusut tanpa ada zoom), jadi memakainya akan menggeser baseline selamanya. */
  baseDpr = ratio < 0.98 ? dpr / ratio : dpr;
}

export function getBrowserZoom(): number {
  if (!baseDpr) calibrate();

  const dpr = window.devicePixelRatio || 1;
  /* Pinch (visualViewport.scale) dikalikan: saat browser zoom murni scale
   * pinch = 1, jadi faktor pinch adalah multiplier murni terhadap baseline. */
  const pinch =
    typeof visualViewport !== "undefined" ? (visualViewport?.scale ?? 1) : 1;
  const zoom = Math.round((dpr / baseDpr) * pinch * 100) / 100;

  /* Nilai tidak masuk akal = gangguan (pindah monitor, dll) -> anggap 100%. */
  if (!Number.isFinite(zoom) || zoom < 0.1 || zoom > 5) return 1;

  /* Dead zone ±2%: buang noise pecahan supaya --zoom tidak flip-flop dan
   * ScrollTrigger tidak di-refresh sia-sia. */
  return Math.abs(zoom - 1) <= 0.02 ? 1 : zoom;
}
