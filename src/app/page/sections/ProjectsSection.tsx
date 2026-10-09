"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useLanguage } from "@/app/contexts/LanguageContext";
import { projectsData } from "@/app/data/projectsData";
import { getBrowserZoom } from "@/app/functions/BrowserZoom";

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
 * KONFIGURASI
 * Semua angka tunable ada di sini; jumlah card diambil dari projectsData. */

/* --- Geometri slot -------------------------------------------------------
 * Kartu ditengahkan flexbox .ps-slot (bukan transform) agar xPercent &
 * yPercent GSAP bebas untuk offset slot; semua offset persen ukuran kartu. */
const SIDE_SCALE = 0.85; // skala kartu di slot kiri & kanan bawah
const SIDE_ALPHA = 0.85; // opacity kartu di slot kiri & kanan bawah (sesuai permintaan 0.85)
const SIDE_X_PERCENT = 110; // offset horizontal, % dari lebar kartu (diperlebar sedikit agar tidak terlalu mepet)
const SIDE_Y_PERCENT = 25; // offset vertikal ke bawah, % dari tinggi kartu (dinaikkan sedikit ke atas)
const EDGE_MARGIN_X = 12; // px, jarak aman kartu sisi dari tepi kiri/kanan deck
const EDGE_MARGIN_Y = 12; // px, jarak aman tepi bawah kartu sisi dari deck

/* Slot "di luar layar" kini dibangun di buildSlots(); OFFSCREEN_PAD hanya
 * sisaan budgets lama yang belum dipakai lagi. */
const OFFSCREEN_PAD = 0.04; // dari lebar deck, biar kartu benar-benar keluar layar

/* Alpha dipisah dari transform agar kartu keluar & kartu baru tidak tumpang tindih. */
const EXIT_FADE = 0.45; // porsi langkah untuk memudupkan kartu yang keluar
const ENTER_DELAY = 0.55; // mulai memunculkan kartu baru di porsi ini
const ENTER_FADE = 0.45; // porsi langkah untuk memunculkan kartu baru

/* z-index per SLOT; GSAP meng-interpolasi, jadi pergantian fokus terasa mulus. */
const Z_OUT = 1;
const Z_SIDE = 5;
const Z_FOCUS = 10;

/* --- Durasi timeline (satuan waktu GSAP, bukan px) ---------------------- */
const PL_ENTRANCE_DUR = 1; // police line masuk dari kiri/kanan
const HOLD_DUR = 0.35; // jeda setelah police line masuk, sebelum kartu jalan
const STEP_DUR = 1; // durasi satu langkah konveyor
const PL_EXIT_DUR = 1; // police line "habis"

/* Jarak scroll = durasi timeline x rasio ini (vh); kecepatan geser konstan. */
const SCROLL_VH_PER_TIME = 0.85;

/* PL_DRIFT_VW = jarak total drift police line selama scroll, fraksi lebar viewport. */
const PL_DRIFT_VW = 1;

/* Drift = DRIFT SCROLL (di-scrub timeline) + DRIFT IDLE (tetap, dibekukan saat
 * timeline bergerak — dideteksi dari selisih tl.time() antar frame).
 * PL_IDLE_SPEED_PX_PER_SEC dalam px/detik: 3 nyaris diam, 15 pelan noticeable. */
const PL_IDLE_SPEED_PX_PER_SEC = 20;

/* Entrance & "habis" memakai kelompok arah yang sama, jadi line yang masuk dari
 * kiri keluar kembali ke kiri. */
function plGroups(root: HTMLElement) {
  const lines = gsap.utils.toArray<HTMLElement>(".police-line", root);
  return {
    toRight: lines.filter((el) => el.classList.contains("slide-right")),
    toLeft: lines.filter((el) => el.classList.contains("slide-left")),
  };
}

/* Keadaan "BELUM diakses": police line kembali persis ke frame 0 (ke luar layar
 * sesuai arah, transparan, motif belum bergeser). Dipakai kedua mode. */
function plNotAccessedState(
  toRight: HTMLElement[],
  toLeft: HTMLElement[],
): () => void {
  return () => {
    gsap.set(toRight, {
      xPercent: -100,
      autoAlpha: 0,
      backgroundPositionX: 0,
    });
    gsap.set(toLeft, {
      xPercent: 100,
      autoAlpha: 0,
      backgroundPositionX: 0,
    });
  };
}

/* Jarak total drift police line, dalam px: PL_DRIFT_VW x lebar viewport. */
const driftDist = () => Math.round(window.innerWidth * PL_DRIFT_VW);

const PL_PULSE_DIM = 0.45; // level redup terkecil
const PL_PULSE_SECONDS = 1.5; // satu siklus terang -> redup -> terang

/* Kedip police line (dulu keyframe `pulseDim`): diputar pada CONTAINER, bukan
 * per-line, karena `opacity` tiap line sudah dipakai timeline. */
function createPlPulse(section: HTMLElement) {
  const wrap = section.querySelector<HTMLElement>(".police-lines-container");
  if (!wrap) return null;
  return gsap.to(wrap, {
    opacity: PL_PULSE_DIM,
    duration: PL_PULSE_SECONDS / 2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    paused: true,
  });
}

/* Media query yang mengaktifkan mode deck. Harus SAMA dengan CSS. */
const DECK_MEDIA =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/* Mode statis: kartu vertikal tanpa pinning, tapi police line tetap harus
 * punya siklus hidup sama (masuk -> drift -> habis). Syarat GSAP di sini WAJIB
 * komplementer dengan DECK_MEDIA, dan SAMA dengan blok CSS "MODE ANIMASI". */
const STATIC_MEDIA =
  "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";

/* Class Tailwind (base card styling) — literal string supaya scanner
 * Tailwind v4 tetap mendeteksinya. */
const CARD_CLASS =
  "ps-card project-card relative flex flex-col w-[min(420px,76vw)] h-[500px] " +
  "rounded-[20px] p-4 border-[length:1.5px] border-[color:var(--cyan-border)] " +
  "bg-transparent backdrop-blur-[5px] " +
  "shadow-[0_4px_15px_var(--cyan-glow),0_20px_40px_rgb(0_0_0/0.1)] " +
  "transition-[box-shadow,border-color] duration-300 " +
  "hover:border-[color:var(--cyan-primary)] " +
  "hover:shadow-[0_0_25px_var(--cyan-glow-hover),0_20px_40px_rgb(0_0_0/0.15)]";

const sectionTranslations = {
  ID: {
    heading: "Proyek",
    subheading: "Beberapa karya terbaru saya",
    liveDemo: "Demo Langsung",
    sourceCode: "Kode Sumber",
  },
  EN: {
    heading: "Projects",
    subheading: "Some of my recent work",
    liveDemo: "Live Demo",
    sourceCode: "Source Code",
  },
};

/* useLayoutEffect di browser supaya kartu tidak "flash" di posisi akhir
 * sebelum GSAP memasang state awal; useEffect di server agar aman SSR. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type SlotState = {
  /* Offset dalam persen ukuran kartu sendiri — satu satuan untuk semua slot,
   * jadi proporsinya terjaga otomatis di tiap ukuran layar. */
  xPercent: number;
  yPercent: number;
  /* px: selalu 0, supaya transform sisa dari mount sebelumnya ikut ter-reset. */
  x: number;
  y: number;
  scale: number;
  rotation: number;
  autoAlpha: number;
  zIndex: number;
};

/* Tahap tiap kartu pada konveyor. Kartu tidak "diantar" ke slot satu per satu,
 * tapi maju satu tahap tiap langkah scroll — jadi posisinya cukup dinyatakan
 * sebagai fungsi (langkah, index kartu), bukan tabel koordinat per kartu. */
const STAGE = {
  OFF_RIGHT: 0,
  BOTTOM_RIGHT: 1,
  CENTER: 2,
  BOTTOM_LEFT: 3,
  OFF_LEFT: 4,
} as const;

/* Tahap kartu berindex `index` setelah `step` langkah. Karena jarak antar kartu
 * selalu tepat satu tahap, tiap langkah hanya menyisakan empat jalur yang sama
 * persis: CENTER -> BOTTOM_LEFT, BOTTOM_RIGHT -> CENTER, OFF_RIGHT ->
 * BOTTOM_RIGHT, BOTTOM_LEFT -> OFF_LEFT. */
const stageAt = (step: number, index: number) => step - index + 2;

/* Easing per jalur: masuk menempel di slot (out), naik ke tengah dan turun
 * ke bawah sama-sama pelan di awal & akhir (inOut), sedangkan yang dibuang
 * ke kiri justru makin cepat (in) supaya terasa "dibuang". */
const LANE_EASE: Record<number, string> = {
  [STAGE.OFF_RIGHT]: "power2.out",
  [STAGE.BOTTOM_RIGHT]: "power2.inOut",
  [STAGE.CENTER]: "power2.inOut",
  [STAGE.BOTTOM_LEFT]: "power2.in",
};

/* Jadwal alpha per jalur, pecahan dari STEP_DUR. Karena EXIT_FADE (0.45) <
 * ENTER_DELAY (0.55), kartu keluar & kartu baru tidak pernah tumpang tindih. */
const ALPHA_LANE: Record<
  number,
  { delay: number; dur: number; ease: string }
> = {
  [STAGE.OFF_RIGHT]: {
    delay: ENTER_DELAY,
    dur: ENTER_FADE,
    ease: "power1.out",
  },
  [STAGE.BOTTOM_RIGHT]: { delay: 0, dur: 1, ease: "power1.inOut" },
  [STAGE.CENTER]: { delay: 0, dur: 1, ease: "power1.inOut" },
  [STAGE.BOTTOM_LEFT]: { delay: 0, dur: EXIT_FADE, ease: "power1.in" },
};

/* Koordinat kelima slot dari ukuran deck & kartu yang terukur; offset dijepit ke
 * ruang deck yang tersedia supaya kartu sisi tak pernah terpotong tepi. */
function buildSlots(
  deckW: number,
  deckH: number,
  cardW: number,
  cardH: number,
): Record<number, SlotState> {
  const sideHalfW = (SIDE_SCALE * cardW) / 2;
  const sideHalfH = (SIDE_SCALE * cardH) / 2;

  /* Sisi kartu diukur setelah dikecilkan (0.85) — inilah yang harus muat. */
  const xPercent = Math.min(
    SIDE_X_PERCENT,
    Math.max(0, ((deckW / 2 - EDGE_MARGIN_X - sideHalfW) / cardW) * 100),
  );
  const yPercent = Math.min(
    SIDE_Y_PERCENT,
    Math.max(0, ((deckH / 2 - EDGE_MARGIN_Y - sideHalfH) / cardH) * 100),
  );

/* Slot "di luar layar" - spawn dari bawah tengah, exit ke bawah tengah */
  const offBottomY = 100; // % dari tinggi kartu (sesuai spesifikasi yPercent +100%)
  const offBottomXRight = 40; // % dari lebar kartu (xPercent +40%)
  const offBottomXLeft = -40; // % dari lebar kartu (xPercent -40%)

  /* Slot kiri & kanan bawah sesuai spesifikasi */
  const side = {
    x: 0,
    y: 0,
    scale: SIDE_SCALE,
    rotation: 0,
  };

  return {
    [STAGE.OFF_RIGHT]: {
      ...side,
      xPercent: offBottomXRight,
      yPercent: offBottomY,
      autoAlpha: 0,
      zIndex: Z_OUT,
    },
    [STAGE.BOTTOM_RIGHT]: {
      ...side,
      xPercent: SIDE_X_PERCENT,
      yPercent: SIDE_Y_PERCENT,
      autoAlpha: SIDE_ALPHA,
      zIndex: Z_SIDE,
    },
    [STAGE.CENTER]: {
      xPercent: 0,
      yPercent: 0,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      autoAlpha: 1,
      zIndex: Z_FOCUS,
    },
    [STAGE.BOTTOM_LEFT]: {
      ...side,
      xPercent: -SIDE_X_PERCENT,
      yPercent: SIDE_Y_PERCENT,
      autoAlpha: SIDE_ALPHA,
      zIndex: Z_SIDE,
    },
    [STAGE.OFF_LEFT]: {
      ...side,
      xPercent: offBottomXLeft,
      yPercent: offBottomY,
      autoAlpha: 0,
      zIndex: Z_OUT,
    },
  };
}

export default function ProjectsSection() {
  const { lang } = useLanguage();
  const t = sectionTranslations[lang] || sectionTranslations.EN;

  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  /* Semua project ikut deck; tidak ada konstanta yang perlu disinkronkan
   * dengan projectsData. */
  const cards = projectsData;

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add({ deck: DECK_MEDIA }, (ctx) => {
      const { deck: deckEnabled } = ctx.conditions as { deck: boolean };
      if (!deckEnabled) return;

      const cardEls = gsap.utils.toArray<HTMLElement>(".ps-card", section);
      const total = cardEls.length;
      if (total === 0) return;

      const progressBar = progressRef.current;
      const deckEl = section.querySelector<HTMLElement>(".ps-deck");

      /* Geometri slot diukur sekali per siklus refresh (cache dibuang di
       * onRefreshInit), jadi resize / ganti bahasa tak perlu bangun ulang timeline.
       * gunakan getBoundingClientRect() untuk menghindari masalah ketika
       * offsetWidth/include transform dari element parent sebelumnya. */
      let cachedSlots: Record<number, SlotState> | null = null;
      const slots = (): Record<number, SlotState> => {
        if (cachedSlots) return cachedSlots;

        const rect = deckEl?.getBoundingClientRect() || { width: 0, height: 0 };
        const deckW = rect.width;
        const deckH = rect.height;

        let cardW = 0;
        let cardH = 0;
        for (const card of cardEls) {
          const cardRect = card.getBoundingClientRect();
          if (cardRect.width > cardW) cardW = cardRect.width;
          if (cardRect.height > cardH) cardH = cardRect.height;
        }
        cachedSlots = buildSlots(deckW, deckH, cardW || 420, cardH || 520);
        return cachedSlots;
      };

      /* Tahap dijepit ke 0..4 supaya value function selalu punya slot — tahap di luar
       * itu (kartu sudah habis) memakai slot tepi, bukan undefined. */
      const slotOf = (stage: number): SlotState =>
        slots()[Math.min(STAGE.OFF_LEFT, Math.max(STAGE.OFF_RIGHT, stage))];

      const slotVars = (stage: number) => ({
        xPercent: () => slotOf(stage).xPercent,
        yPercent: () => slotOf(stage).yPercent,
        x: () => slotOf(stage).x,
        y: () => slotOf(stage).y,
        scale: () => slotOf(stage).scale,
        rotation: () => slotOf(stage).rotation,
        zIndex: () => slotOf(stage).zIndex,
      });
      const slotAlpha = (stage: number) => ({
        autoAlpha: () => slotOf(stage).autoAlpha,
      });

      /* Entrance police line dipakai bersama sebagai jalan masuk kartu pertama,
       * lalu HOLD_DUR, lalu konveyor. */
      const conveyorStart = PL_ENTRANCE_DUR + HOLD_DUR;
      /* Extra step to ensure cards fully exit */
      const steps = total + 1;

      /* Kartu terakhir selalu berakhir di jalur BOTTOM_LEFT -> OFF_LEFT, dan autoAlpha-nya
       * sudah 0 sebelum transform itu selesai — jadi police line "habis" dipicu saat jalur
       * alpha terakhir selesai, agar tidak ada scroll mati. */
      const lastLaneAt = stageAt(steps - 1, total - 1);
      const lastLane = ALPHA_LANE[lastLaneAt];
      const plExitTime =
        conveyorStart +
        (steps - 1) * STEP_DUR +
        STEP_DUR * (lastLane.delay + lastLane.dur);

      /* Proxy DRIFT SCROLL (di-scrub timeline) + offset DRIFT IDLE (px, hanya bertambah).
       * Ditulis ke DOM oleh satu callback ticker — lihat blok police line di bawah. */
      const plDriftScroll = { x: 0 };
      let plIdlePx = 0;
      let plTickerCleanup: (() => void) | null = null;
      /* Reset "belum diakses" — diisi setelah kelompok line diketahui, lalu dipanggil
       * dari onLeave / onLeaveBack di bawah. */
      let plNotAccessed: (() => void) | null = null;

      /* gunakan visualViewport.width yang stabil untuk drift calculation.
       * gunakan document.documentElement.clientWidth sebagai fallback.
       * Hindari window.innerWidth karena bisa berubah saat browser zoom dan
       * menyebabkan drift progresif. */
      const vv = typeof visualViewport !== "undefined" ? visualViewport : null;
      const getDriftViewportWidth = (): number => {
        if (vv) {
          return vv.width;
        }
        return document.documentElement.clientWidth;
      };

      /* Drift dipakai oleh GSAP sebagai translate px di dalam
       * .ps-scalable-content (satuan lokal wrapper yang di-scale 1/z).
       * visualViewport.width dalam satuan root (ikut membesar/mengecil saat
       * zoom), jadi dikalikan --zoom dulu: setelah dilukis 1/z hasilnya
       * persis 1 lebar viewport di layar. */
      const driftDist = () =>
        Math.round(getDriftViewportWidth() * getBrowserZoom() * PL_DRIFT_VW);

      /* Posisi awal: semua kartu di luar layar (OFF_RIGHT, kanan) dan transparan —
       * persis tahap kartu 0 sebelum langkah pertama, jadi tidak ada kartu yang
       * "muncul dari tengah". */
      const applyRest = () => {
        const offRight = slots()[STAGE.OFF_RIGHT];
        cardEls.forEach((card) => {
          gsap.set(card, { ...offRight, autoAlpha: 0 });
        });
      };
      applyRest();

      const pulse = createPlPulse(section);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinType: "transform",
          pinSpacing: true,
          start: "top top", // pin saat section menyentuh atas viewport
          /* Jarak scroll dibuat proporsional dengan durasi timeline, jadi kecepatan
           * menggeser kartu konstan dari fase entrance sampai police line habis. */
          end: () =>
            `+=${Math.round(
              (plExitTime + PL_EXIT_DUR) *
                window.innerHeight *
                SCROLL_VH_PER_TIME,
            )}`,
          /* Lenis sudah melakukan smoothing scroll-nya sendiri. scrub numerik
           * adalah lapisan easing KEDUA yang mengejar posisi yang sudah dil smoothly
           * — dua easing bertumpuk + lagSmoothing(0) bikin kecepatannya naik-turun
           * tiap frame, dan itu yang terbaca sebagai "bergetar". scrub: true
           * membuat timeline mengikuti Lenis apa adanya (tidak ada interpolasi
           * tambahan), jadi geraknya tetap mulus. */
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          /* Buang cache geometri slot di awal siklus refresh supaya slotVars() membaca
           * ukuran deck/kartu yang sudah terbaru. */
          onRefreshInit: () => {
            cachedSlots = null;
          },
          onEnter: () => pulse?.play(),
          onEnterBack: () => pulse?.play(),
          /* Section tidak diakses lagi -> kembalikan police line ke frame 0 (lihat
           * plNotAccessedState). Dilakukan di kedua arah supaya kunjungan
           * berikutnya selalu mengulang entrance dari awal. */
          onLeave: () => {
            plNotAccessed?.();
            pulse?.pause();
          },
          onLeaveBack: () => {
            plNotAccessed?.();
            pulse?.pause();
          },
        },
      });

      /* Progress bar mengikuti progres timeline (scrub, tanpa React state) */
      if (progressBar) {
        tl.fromTo(
          progressBar,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", duration: plExitTime },
          0,
        );
        /* Bar ditahan di 100% selama animasi police line habis */
        tl.to(
          progressBar,
          { scaleX: 1, ease: "none", duration: PL_EXIT_DUR },
          plExitTime,
        );
      }

      /* Counter "01 / 06" dihitung dari progres yang sama dengan progress bar,
       * ditulis langsung ke DOM (tanpa setState 60fps). */
      const counterEl = counterRef.current;
      if (counterEl) {
        const counterState = { v: 0 };
        tl.fromTo(
          counterState,
          { v: 0 },
          {
            v: 1,
            ease: "none",
            duration: plExitTime,
            onUpdate: () => {
              /* Konveyor menampilkan `total` kartu; progres 0..1 dipetakan
               * ke nomor kartu 01..total. */
              const n = Math.min(
                total,
                Math.max(1, Math.ceil(counterState.v * total)),
              );
              counterEl.textContent = `${String(n).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
            },
          },
          0,
        );
      }

      /* ENTRANCE KARTU PERTAMA — applyRest() menaruh semua kartu di OFF_RIGHT tapi
       * langkah pertama konveyor untuk kartu 0 dimulai dari CENTER, jadi tanpa tween ini
       * kartu 0 meloncat ke tengah. Jalur PERSIS sama seperti kartu lain: OFF_RIGHT -> BOTTOM_RIGHT -> CENTER. */
      tl.fromTo(
        cardEls[0],
        slotVars(STAGE.BOTTOM_RIGHT),
        {
          ...slotVars(STAGE.CENTER),
          duration: conveyorStart,
          ease: "power2.inOut",
          immediateRender: false,
        },
        0,
      );

      /* Alpha-nya cermin jalur OFF_RIGHT di ALPHA_LANE, hanya satuan waktunya STEP_DUR
       * diganti jadi conveyorStart — fade selesai tepat saat konveyor pertama mulai. */
      const enterLane = ALPHA_LANE[STAGE.OFF_RIGHT];
      tl.fromTo(
        cardEls[0],
        slotAlpha(STAGE.OFF_RIGHT),
        {
          ...slotAlpha(STAGE.CENTER),
          duration: conveyorStart * enterLane.dur,
          ease: enterLane.ease,
          immediateRender: false,
        },
        conveyorStart * enterLane.delay,
      );

      /* KONVEYOR KARTU — tiap langkah menjalankan empat jalur paralel (lihat stageAt).
       * Transform & alpha sengaja dipisah: kalau alpha ikut transform, mata bisa membaca
       * empat kartu bertumpuk; dengan ALPHA_LANE maksimal tiga. */
      for (let step = 1; step <= steps; step++) {
        const at = conveyorStart + (step - 1) * STEP_DUR;

        cardEls.forEach((card, index) => {
          const from = stageAt(step - 1, index);

          /* Kartu belum masuk panggung: belum ada jalur yang perlu dijalankan. */
          if (from < STAGE.OFF_RIGHT) return;

          /* Kartu sudah lewat OFF_LEFT — tidak ada slot untuk melanjutkannya,
           * jadi cukup ditahan tersembunyi di posisi terakhirnya. */
          if (from > STAGE.OFF_LEFT) {
            tl.set(card, { autoAlpha: 0 }, at);
            return;
          }

          /* OFF_LEFT adalah slot terakhir dan alpha di slot itu sudah 0, jadi
           * kartu yang sudah tiba di sana hanya perlu dijepit di tempat —
           * tidak ada transform maupun fade lanjutan. */
          if (from === STAGE.OFF_LEFT) {
            tl.set(card, { ...slots()[STAGE.OFF_LEFT] }, at);
            return;
          }

          /* Sisa kasus: from berada di OFF_RIGHT..BOTTOM_LEFT, jadi from + 1
           * selalu slot yang ada. */
          const to = from + 1;

          tl.fromTo(
            card,
            slotVars(from),
            {
              ...slotVars(to),
              duration: STEP_DUR,
              ease: LANE_EASE[from],
              immediateRender: false,
            },
            at,
          );

          const lane = ALPHA_LANE[from];
          tl.fromTo(
            card,
            slotAlpha(from),
            {
              ...slotAlpha(to),
              duration: STEP_DUR * lane.dur,
              ease: lane.ease,
              immediateRender: false,
            },
            at + STEP_DUR * lane.delay,
          );
        });
      }

      /* Jaring pengaman: semua kartu sudah autoAlpha 0 di plExitTime, jadi `set` di
       * detik itu tidak memotong fade kartu terakhir. */
      tl.set(cardEls, { autoAlpha: 0 }, plExitTime);

      /* Kelompok menurut arah gerak (lihat plGroups): toRight = line yang bergerak
       * ke kanan, toLeft = yang ke kiri. */
      const { toRight: plToRight, toLeft: plToLeft } = plGroups(section);
      const plAll = [...plToRight, ...plToLeft];

      if (plAll.length) {
        /* Entrance mengikuti arah drift: yang ke kanan masuk dari KIRI, yang ke kiri dari KANAN.
         * JANGAN pernah bagi satu objek vars untuk dua fromTo — GSAP menulis property internal
         * ke objek itu, jadi tween kedua mengambil alih tween pertama. */
        tl.fromTo(
          plToRight,
          { xPercent: -100, autoAlpha: 0 },
          {
            xPercent: 0,
            autoAlpha: 1,
            duration: PL_ENTRANCE_DUR,
            ease: "power3.out",
          },
          0,
        );
        tl.fromTo(
          plToLeft,
          { xPercent: 100, autoAlpha: 0 },
          {
            xPercent: 0,
            autoAlpha: 1,
            duration: PL_ENTRANCE_DUR,
            ease: "power3.out",
          },
          0,
        );

        /* DRIFT SCROLL: objek proxy, bukan elemen. Proxy-nya yang di-scrub timeline;
         * backgroundPositionX ke DOM digabung dengan DRIFT IDLE di satu callback
         * ticker — dua tween yang menulis properti sama akan saling menimpa. */
        tl.fromTo(
          plDriftScroll,
          { x: 0 },
          {
            x: () => driftDist(),
            duration: plExitTime - PL_ENTRANCE_DUR,
            ease: "none",
            immediateRender: false,
          },
          PL_ENTRANCE_DUR,
        );

        /* Satu-satunya penulis backgroundPositionX untuk police line. Dipasang
         * di ticker supaya idle tetap jalan meski timeline tidak render. */
        let lastTlTime = tl.time();
        let lastRightPx = NaN;
        const applyPlDrift = () => {
          const st = tl.scrollTrigger;
          if (st && !st.isActive) return;

          const now = tl.time();
          const scrubbing = Math.abs(now - lastTlTime) > 0.0001;
          lastTlTime = now;

          /* Idle satu arah: cuma nambah, tidak pernah dibalik atau di-reset, jadi tidak ada
           * patahan. Bayangan velocity: deltaRatio() = jumlah frame (relatif 60fps),
           * clamp 6 supaya tab yang ditinggal lama tidak meloncat. */
          if (!scrubbing) {
            const dtSec = Math.min(gsap.ticker.deltaRatio(), 6) / 60;
            plIdlePx += PL_IDLE_SPEED_PX_PER_SEC * dtSec;
          }

          /* Scroll ke kanan (+), idle ke kanan (+); untuk line ke kiri keduanya dibalik
           * tanda. Nilai dibulatkan ke piksel utuh DAN hanya ditulis ke DOM kalau
           * berubah — background-position tidak bisa dipromosikan compositor, jadi
           * setiap penulisan berarti raster ulang elemen selebar 300% viewport. */
          const rightPx = Math.round(plDriftScroll.x + plIdlePx);
          if (rightPx === lastRightPx) return;
          lastRightPx = rightPx;

          for (let i = 0; i < plToRight.length; i++) {
            plToRight[i].style.backgroundPositionX = `${rightPx}px`;
          }
          for (let i = 0; i < plToLeft.length; i++) {
            plToLeft[i].style.backgroundPositionX = `${-rightPx}px`;
          }
        };
        gsap.ticker.add(applyPlDrift);
        plTickerCleanup = () => gsap.ticker.remove(applyPlDrift);

        /* Reset saat section tidak diakses: selain frame 0, idle drift juga dinolkan —
         * tanpa ini tiap kunjungan mewarisi sisa akumulasi dan motif makin jauh geser. */
        const resetLines = plNotAccessedState(plToRight, plToLeft);
        plNotAccessed = () => {
          plIdlePx = 0;
          lastTlTime = tl.time();
          resetLines();
        };

        /* "HABIS" — entrance dibalik persis: yang ke kanan balik ke KIRI, yang ke kiri balik
         * ke KANAN, jaraknya sama & fade-nya dibalik (power3.in cermin power3.out).
         * plAll disusun ke-kanan dulu, jadi indeks < toRight.length = kelompok ke kanan. */
        const exit = {
          xPercent: (i: number) => (i < plToRight.length ? -100 : 100),
          autoAlpha: 0,
          duration: PL_EXIT_DUR,
          ease: "power3.in",
          immediateRender: false,
        };
        tl.fromTo(plAll, { xPercent: 0, autoAlpha: 1 }, exit, plExitTime);
      }

      if (typeof window !== "undefined") {
        (window as unknown as Record<string, unknown>).__psDebug = {
          cardCount: total,
          steps,
          slots: () => slots(),
          /* Tahap tiap kartu setelah `step` langkah — dipakai buat cek apakah urutannya
           * center -> kanan bawah -> kiri bawah -> luar. */
          stagesAt: (step: number) =>
            cardEls.map((_, i) => stageAt(step, i)),
          tlDuration: tl.duration(),
          plExitTime,
          plDrift: driftDist(),
          plIdlePx: () => plIdlePx,
          /* Paksa kondisi "belum diakses" tanpa harus scroll — buat cek manual bahwa
           * kunjungan berikutnya mulai dari frame 0. */
          resetPl: () => plNotAccessed?.(),
          transforms: cardEls.map((c) => c.style.transform || "(none)"),
          plState: () =>
            plAll.map((el) => ({
              cls: el.className,
              opacity: getComputedStyle(el).opacity,
              visibility: getComputedStyle(el).visibility,
              transform: el.style.transform || "(none)",
              bgX: getComputedStyle(el).backgroundPositionX,
            })),
        };
      }

      const images = Array.from(section.querySelectorAll("img"));
      let pending = images.filter((img) => !img.complete).length;
      let done = false;
      let refreshTimer = 0;

      const onImageLoad = () => {
        if (done) return;
        pending -= 1;
        if (pending > 0) return;

        done = true;
        /* Ditunda: refresh yang jatuh di tengah scroll (bukan leisure) membuat
         * pin dihitung ulang saat user sedang bergerak -> posisi section
         * meloncat sesaat. Enough delay = tunggu scroll selesai dulu. */
        refreshTimer = window.setTimeout(() => {
          if (!tl.scrollTrigger?.isActive) ScrollTrigger.refresh();
        }, 350);
      };

      if (pending > 0) {
        images.forEach((img) =>
          img.addEventListener("load", onImageLoad, { once: true }),
        );
      }

      return () => {
        done = true;
        window.clearTimeout(refreshTimer);
        /* Ticker harus dilepas saat matchMedia di-revert, kalau tidak
         * backgroundPositionX masih ditulis tiap frame walau section sudah
         * tidak ada (mis. breakpoint berubah ke mode statis). */
        plTickerCleanup?.();
        plTickerCleanup = null;
        plNotAccessed = null;
        images.forEach((img) => img.removeEventListener("load", onImageLoad));
      };
    });

    mm.add({ staticMode: STATIC_MEDIA }, (ctx) => {
      const { staticMode } = ctx.conditions as { staticMode: boolean };
      if (!staticMode) return;

      /* Kelompok arah yang sama persis dengan mode deck (class slide-*), supaya arah
       * line tidak beda antar mode. */
      const { toRight, toLeft } = plGroups(section);
      const lines = [...toRight, ...toLeft];
      if (!lines.length) return;

      const pulse = createPlPulse(section);

      /* Reset "belum diakses" untuk mode statis — sama seperti di mode deck. */
      const resetLines = plNotAccessedState(toRight, toLeft);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          /* Sama seperti mode deck: Lenis yang menangani smoothing, jadi timeline
           * tidak adds easing kedua (lihat catatan scrub di mode deck). */
          scrub: true,
          invalidateOnRefresh: true,
          onEnter: () => pulse?.play(),
          onEnterBack: () => pulse?.play(),
          /* Section tidak diakses lagi -> kembalikan police line ke frame 0. */
          onLeave: () => {
            resetLines();
            pulse?.pause();
          },
          onLeaveBack: () => {
            resetLines();
            pulse?.pause();
          },
        },
      });

      /* 1) MASUK — mengikuti arah drift, seperti di mode deck: yang ke kanan masuk
       * dari kiri, yang ke kiri masuk dari kanan. */
      tl.fromTo(
        toRight,
        { xPercent: -100, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 0.2, ease: "power3.out" },
        0,
      );
      tl.fromTo(
        toLeft,
        { xPercent: 100, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 0.2, ease: "power3.out" },
        0,
      );

      tl.fromTo(
        toRight,
        { backgroundPositionX: 0 },
        {
          backgroundPositionX: () => driftDist(),
          duration: 0.62,
          ease: "none",
          immediateRender: false,
        },
        0.2,
      );
      tl.fromTo(
        toLeft,
        { backgroundPositionX: 0 },
        {
          backgroundPositionX: () => -driftDist(),
          duration: 0.62,
          ease: "none",
          immediateRender: false,
        },
        0.2,
      );

      /* "HABIS" — entrance dibalik persis, sama seperti di mode deck: yang ke kanan
       * balik ke KIRI, yang ke kiri balik ke KANAN, jaraknya sama (100),
       * fade 1 -> 0 dengan ease power3.in. */
      tl.fromTo(
        lines,
        { xPercent: 0, autoAlpha: 1 },
        {
          xPercent: (i: number) => (i < toRight.length ? -100 : 100),
          autoAlpha: 0,
          duration: 0.18,
          ease: "power3.in",
          immediateRender: false,
        },
        0.82,
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="project-section scroll-margin-top relative"
    >
      {/* Wrapper tunggal semua visual section ini (kartu, header, police line).
          Scale 1/z versi --zoom menempel di sini, bukan di #main, jadi koordinat
          ScrollTrigger untuk elemen yang di-pin tetap utuh. */}
      <div className="ps-scalable-content">
        {/* Latar police line. Class slide-right / slide-left = arah gerak (urutannya
            selang-seling); entrance & "habis" memakai class yang sama, jadi tiap line
            balik ke sisi asalnya. */}
        <div className="police-lines-container" aria-hidden="true">
          <div className="police-line line-top slide-right is-visible" />
          <div className="police-line-wrapper line-bottom-wrapper">
            <div className="police-line line-bottom slide-left is-visible" />
          </div>
          <div className="police-line-wrapper diag-1-wrapper">
            <div className="police-line line-diagonal slide-right is-visible" />
          </div>
          <div className="police-line-wrapper diag-2-wrapper">
            <div className="police-line line-diagonal slide-left is-visible" />
          </div>
        </div>

        <div className="ps-stage">
          <div className="section-title text-center mb-3">
            <h2>{t.heading}</h2>
            <p className="project-description mb-0">{t.subheading}</p>
          </div>

          {/* Tiap kartu punya slot absolut yang menjadi containing block,
              lalu GSAP yang menengahkan + meng-offset setiap kartu di dalamnya. */}
          <div className="ps-deck">
            {cards.map((project, index) => (
              <div className="ps-slot" key={project.id}>
                {/* zIndex inline hanya fallback pre-hydration (kartu 1 = fokus,
                    kartu 2 = slot kanan bawah, sisanya menunggu di luar layar).
                    Setelah mount, GSAP yang mengaturnya per tahap konveyor. */}
                <article
                  className={CARD_CLASS}
                  style={{
                    zIndex: index === 0 ? Z_FOCUS : index === 1 ? Z_SIDE : Z_OUT,
                  }}
                  aria-label={`${project.title[lang]} — ${project.category}, ${project.year}`}
                >
                  <div className="project-img-wrapper group mb-3">
                    <img
                      src={project.image}
                      alt={project.title[lang]}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Link
                      href={`/projects/${project.slug}`}
                      className="arrow-btn absolute top-3 right-3 grid place-items-center"
                      aria-label={`Lihat detail ${project.title[lang]}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </Link>
</div>

                  <div className="flex flex-col grow">
                    <span className="project-category-badge mb-2 self-start">
                      {project.category}
                    </span>

                    <h3 className="project-title mb-2">{project.title[lang]}</h3>

                    <p className="project-description mb-3">
                      {project.description[lang]}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto mb-3">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <hr className="project-divider my-2" />

                    <div className="flex items-center justify-around pt-2">
                      <a
                        href={project.liveLink}
                        className="project-link inline-flex items-center gap-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span>{t.liveDemo}</span>
                      </a>

                      <div className="link-separator" aria-hidden="true" />

                      <a
                        href={project.githubLink}
                        className="project-link inline-flex items-center gap-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                        <span>{t.sourceCode}</span>
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {/* Progress bar + counter deck (digerakkan scrub, bukan React state) */}
          <div className="ps-progress-row" aria-hidden="true">
            <div className="ps-progress">
              <span ref={progressRef} className="ps-progress-bar" />
            </div>
            <span ref={counterRef} className="ps-counter">
              01 / {String(cards.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
