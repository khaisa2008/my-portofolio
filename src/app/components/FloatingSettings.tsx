"use client";

import { useEffect, useRef, useState } from "react";
import "@/app/animation/FloatingSettings.css";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useLanguage } from "@/app/contexts/LanguageContext";

/* 2 flag inline — menggantikan paket flag-icons (CSS global hanya untuk
 * 2 bendera). viewBox 0 0 3 2 (rasio bendera standar). */
function FlagIcon({ id }: { id: "id" | "us" }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 3 2",
    className: "rounded-circle",
    "aria-hidden": true,
  } as const;

  if (id === "id") {
    return (
      <svg {...common}>
        <rect width="3" height="1" fill="#ce1126" />
        <rect y="1" width="3" height="1" fill="#ffffff" />
        <rect
          width="3"
          height="2"
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="0.04"
        />
      </svg>
    );
  }

  /* Versi sederhana bendera AS: 7 strip merah/putih + kanton biru. */
  return (
    <svg {...common}>
      <rect width="3" height="2" fill="#ffffff" />
      {[0, 2, 4, 6].map((i) => (
        <rect key={i} y={(i * 2) / 13} width="3" height={2 / 13} fill="#b22234" />
      ))}
      <rect width="1.2" height={(2 / 13) * 7} fill="#3c3b6e" />
      <rect
        width="3"
        height="2"
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="0.04"
      />
    </svg>
  );
}

export default function FloatingSettings() {
  const [open, setOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  /* Panel selalu ter-render (supaya animasi buka & tutup sama-sama jalan),
   * jadi Escape/klik di luar perlu listener eksplisit. Escape mengembalikan
   * fokus ke FAB agar screen reader tidak kehilangan titik fokus. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      fabRef.current?.focus();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const t =
    lang === "ID"
      ? {
          openLabel: "Buka pengaturan",
          closeLabel: "Tutup pengaturan",
          title: "Pengaturan",
          eyebrow: "Sistem",
          themeLabel: "Mode Gelap",
          themeOn: "Aktif",
          themeOff: "Mati",
          langLabel: "Bahasa",
          langName: "Bahasa Indonesia",
          langSwitch: "Ganti ke bahasa Inggris",
        }
      : {
          openLabel: "Open settings",
          closeLabel: "Close settings",
          title: "Settings",
          eyebrow: "System",
          themeLabel: "Dark Mode",
          themeOn: "On",
          themeOff: "Off",
          langLabel: "Language",
          langName: "English",
          langSwitch: "Switch to Bahasa Indonesia",
        };

  const closeAndRefocus = () => {
    setOpen(false);
    fabRef.current?.focus();
  };

  return (
    <div className="floating-settings" ref={rootRef}>
      <div
        id="settings-panel"
        className={`settings-card${open ? " is-open" : ""}`}
        role="dialog"
        aria-labelledby="settings-title"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="card-header">
          <div className="header-text">
            <span className="settings-eyebrow">{"// "}{t.eyebrow}</span>
            <h5 id="settings-title">{t.title}</h5>
          </div>
          <button
            type="button"
            className="close-btn"
            aria-label={t.closeLabel}
            onClick={closeAndRefocus}
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        {/* Setting Dark Mode */}
        <div className="setting-item">
          <div className="setting-info">
            <div className="icon-wrapper theme-icon-wrapper">
              <i className="bi bi-brightness-high icon-sun" aria-hidden="true"></i>
              <i className="bi bi-moon-stars icon-moon" aria-hidden="true"></i>
            </div>
            <div className="setting-text">
              <h6>{t.themeLabel}</h6>
              <small>{dark ? t.themeOn : t.themeOff}</small>
            </div>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={dark}
              onChange={toggleTheme}
              aria-label={t.themeLabel}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="divider"></div>

        {/* Setting Bahasa */}
        <div className="setting-item">
          <div className="setting-info">
            <div className="icon-wrapper">
              <FlagIcon id={lang === "ID" ? "id" : "us"} />
            </div>
            <div className="setting-text">
              <h6>{t.langLabel}</h6>
              <small>{t.langName}</small>
            </div>
          </div>

          <button
            type="button"
            className="lang-btn"
            onClick={toggleLang}
            aria-label={t.langSwitch}
          >
            <span className="lang-text">{lang}</span>
            <i className="bi bi-arrow-repeat" aria-hidden="true"></i>
          </button>
        </div>

        <div className="settings-footer">
          <small className="footer-brand">{"// cyan & glass"}</small>
          <span className="footer-version">
            <span className="status-dot" aria-hidden="true"></span>
            v1.0
          </span>
        </div>
      </div>

      <button
        type="button"
        ref={fabRef}
        className={`fab${open ? " active" : ""}`}
        aria-expanded={open}
        aria-controls="settings-panel"
        aria-label={open ? t.closeLabel : t.openLabel}
        onClick={() => setOpen((o) => !o)}
      >
        <i
          className={`bi ${open ? "bi-x-lg" : "bi-gear-wide-connected"}`}
          aria-hidden="true"
        ></i>
      </button>
    </div>
  );
}
