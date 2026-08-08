"use client";

import { useState } from "react";
import "@/app/animation/FloatingSettings.css";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function FloatingSettings() {
  const [open, setOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="floating-settings">
      {open && (
        <div className="settings-card">
          <div className="card-header">
            <h5>{lang === "ID" ? "Pengaturan" : "Settings"}</h5>
            <span className="close-btn" onClick={() => setOpen(false)}>
              ✕
            </span>
          </div>

          {/* Setting Dark Mode */}
          <div className="setting-item">
            <div className="setting-info">
              <div className="icon-wrapper theme-icon-wrapper">
                <i className="bi bi-brightness-high icon-sun"></i>
                <i className="bi bi-moon-stars icon-moon"></i>
              </div>
              <div>
                <h6>{lang === "ID" ? "Mode Gelap" : "Dark Mode"}</h6>
                <small>
                  {dark
                    ? lang === "ID"
                      ? "Aktif"
                      : "On"
                    : lang === "ID"
                      ? "Mati"
                      : "Off"}
                </small>
              </div>
            </div>

            <label className="switch">
              <input type="checkbox" checked={dark} onChange={toggleTheme} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="divider"></div>

          {/* Setting Bahasa */}
          <div className="setting-item">
            <div className="setting-info">
              <div className="icon-wrapper">
                <i
                  className={`fi ${lang === "ID" ? "fi-id" : "fi-us"} fis rounded-circle`}
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "cover",
                  }}
                ></i>
              </div>
              <div>
                <h6>{lang === "ID" ? "Bahasa" : "Language"}</h6>
                <small className="d-flex align-items-center gap-2">
                  {lang === "ID" ? "Bahasa Indonesia" : "English"}
                </small>
              </div>
            </div>

            <button className="lang-btn" onClick={toggleLang}>
              <span className="lang-text">{lang}</span>
              <span className="lang-switch-icon">
                <i className="bi bi-arrow-repeat"></i>
              </span>
            </button>
          </div>

          <div className="settings-footer">
            <small></small>
            <div className="footer-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      )}

      <button
        className={`fab ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <i className={`bi ${open ? "bi-x-lg" : "bi-gear-fill"}`}></i>
      </button>
    </div>
  );
}
