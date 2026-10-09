"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBrowserZoom } from "@/app/functions/BrowserZoom";

export function UseZoomLock() {
  useEffect(() => {
    /* Zoom terakhir yang sudah diterapkan. --zoom mengubah transform wrapper
       section Projects, jadi ScrollTrigger harus di-refresh saat nilainya
       benar-benar berubah. */
    let lastZoom = 0;
    let refreshTimer = 0;

    const updateZoomCompensation = () => {
      /* getBrowserZoom() membaca devicePixelRatio (dan pinch sebagai bonus).
       * visualViewport.scale TIDAK dipakai sebagai deteksi utama karena nilainya
       * tetap 1.0 saat browser zoom di desktop — kompensasi lama mati karenanya. */
      const currentZoom = getBrowserZoom();

      const rootEl = document.documentElement;

      const bgEl = document.querySelector<HTMLElement>(".animated-bg");
      const fsEl = document.querySelector<HTMLElement>(".floating-settings");
      const navEl = document.querySelector<HTMLElement>(".navbar-fixed");

      // KONDISI: Zoom Out (< 100%) atau Zoom In (> 100%)
      // getBrowserZoom() sudah menerapkan dead zone ±2%, jadi 1 = 100% murni.
      if (currentZoom < 0.98 || currentZoom > 1.02) {
        const scaleFactor = 1 / currentZoom;

        /* #main SENGAJA tidak di-scale sama sekali.
         * Scale hanya diterapkan ke .ps-scalable-content di dalam section,
         * jadi #main tetap menjadi containing block stabil untuk ScrollTrigger pin.
         * --zoom hanya dipublish ke :root; section Projects membacanya lewat
         * .ps-scalable-content, jadi tak ada ancestor transform baru di atas #main. */
        rootEl.style.setProperty("--zoom", String(currentZoom));

        // AnimatedBackground (di luar #main, position: fixed)
        // Scale sebaliknya agar ukuran visualnya konstan.
        if (bgEl) {
          bgEl.style.transformOrigin = "top left";
          bgEl.style.transform = `translate3d(0, 0, 0) scale(${scaleFactor})`;
          /* Lebar/tinggi/top ikut dikalikan z: setelah di-scale 1/z, lukisan
           * selalu persis menutup viewport — termasuk saat zoom IN, yang tanpa
           * ini meninggalkan celah di kanan/bawah. */
          bgEl.style.width = `${currentZoom * 100}%`;
          bgEl.style.height = `${currentZoom * 120}vh`;
          bgEl.style.top = `${currentZoom * -10}vh`;
        }

        // FloatingSettings (di luar #main, position: fixed)
        // Scale dari pojok kanan-bawah agar tombol tetap menempel di sudut.
        if (fsEl) {
          fsEl.style.transformOrigin = "bottom right";
          fsEl.style.transform = `scale(${scaleFactor})`;
          fsEl.style.right = `${30 * scaleFactor}px`;
          fsEl.style.bottom = `${30 * scaleFactor}px`;
        }

        // Navbar (di luar #main, position: fixed)
        // Scale dari pojok kiri-atas agar tetap menempel di atas layar.
        if (navEl) {
          navEl.style.transformOrigin = "top left";
          navEl.style.transform = `scale(${scaleFactor})`;
          navEl.style.width = `${currentZoom * 100}%`;
        }
      } else {
        // Kembalikan ke layout responsif alami browser (100% zoom)
        rootEl.style.setProperty("--zoom", "1");

        if (bgEl) {
          bgEl.style.transform = "translate3d(0, 0, 0)";
          bgEl.style.width = "";
          bgEl.style.height = "";
          bgEl.style.top = "";
        }

        if (fsEl) {
          fsEl.style.transform = "none";
          fsEl.style.right = "30px";
          fsEl.style.bottom = "30px";
        }

        if (navEl) {
          navEl.style.transform = "none";
          navEl.style.width = "100%";
        }
      }

      // Refresh ScrollTrigger hanya jika nilai zoom benar-benar berubah
      // dan hindari refresh berulang-ulang di event resize
      if (currentZoom !== lastZoom) {
        lastZoom = currentZoom;
        // Debounce: tunggu 100ms setelah resize berhenti sebelum refresh
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
    };

    /* devicePixelRatio hanya berubah saat browser zoom berubah, jadi
     * matchMedia "resolution" adalah pemicu paling presisi. Query-nya harus
     * dipasang ulang setiap kali berubah (event hanya sekali per query).
     * window/visualViewport resize dipasang sebagai cadangan. */
    let dprMq: MediaQueryList | null = null;

    function watchDpr() {
      if (typeof window.matchMedia !== "function") return;
      dprMq?.removeEventListener("change", onDprChange);
      dprMq = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`,
      );
      dprMq.addEventListener("change", onDprChange);
    }

    function onDprChange() {
      updateZoomCompensation();
      watchDpr();
    }

    const vv = typeof visualViewport !== "undefined" ? visualViewport : null;

    if (vv) vv.addEventListener("resize", updateZoomCompensation);
    window.addEventListener("resize", updateZoomCompensation);
    watchDpr();

    /* ================= BLOKIR ZOOM GESTURE =================
     * Browser tetap BISA di-zoom lewat menu/shortcut, makanya kompensasi di
     * atas wajib ada. Tapi biar MATA pengguna tidak bisa mengubah zoom (yang
     * terasa "zoom lock" sejati), gerakan zoom juga diblokir:
     *   - Ctrl/Cmd + scroll (zoom mouse/pinch pad) -> wheel di-preventDefault,
     *     karena default browser-nya adalah zoom in/out.
     *   - Ctrl/Cmd + "+"/"-"/"0" (shortcut zoom) -> keyboard di-preventDefault.
     * Ini GAGAL dilawan dari sisi OS/browser lain (menu zoom), tapi di situlah
     * kompensasi --zoom mengambil alih supaya tampilan tetap normal. */
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (["+", "=", "-", "_", "0"].includes(e.key)) e.preventDefault();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);

    // Jalankan kalkulasi saat halaman selesai di-render
    updateZoomCompensation();

    return () => {
      if (vv) vv.removeEventListener("resize", updateZoomCompensation);
      window.removeEventListener("resize", updateZoomCompensation);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      dprMq?.removeEventListener("change", onDprChange);
      window.clearTimeout(refreshTimer);
    };
  }, []);
}
