"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useIntersectionObserver } from "@/app/functions/UseIntersectionObserver";
import {
  sendContactMessage,
  type ContactFormState,
} from "@/app/actions/contact";

const CONTACT_EMAIL = "hello@example.com";

const content = {
  ID: {
    eyebrow: "04 — Contact",
    title: "Hubungi Saya",
    subtitle: "Mari bekerja sama",
    nameLabel: "Nama",
    namePlaceholder: "Nama Anda",
    emailLabel: "Email",
    emailPlaceholder: "Email Anda",
    messageLabel: "Pesan",
    messagePlaceholder: "Ceritakan proyek Anda...",
    sendBtn: "Kirim Pesan",
    sendingBtn: "Mengirim...",
    available: "Tersedia untuk proyek baru",
    emailTitle: "Email",
    socialTitle: "Temukan saya",
    copyEmail: "Salin email",
    copied: "Tersalin!",
    errors: {
      SEMUA_FIELD: "Semua kolom wajib diisi.",
      EMAIL_TIDAK_VALID: "Format email tidak valid.",
      TERLALU_PANJANG: "Isi terlalu panjang.",
      TERLALU_SERING: "Terlalu banyak percobaan. Coba lagi nanti.",
      GAGAL_KIRIM: "Gagal mengirim. Coba lagi atau email langsung.",
      BELUM_KONFIGURASI: "Form belum dikonfigurasi — silakan email langsung.",
      UNKNOWN: "Terjadi kesalahan. Coba lagi.",
    } as Record<string, string>,
    successMsg: "Pesan terkirim! Saya akan membalas segera.",
  },
  EN: {
    eyebrow: "04 — Contact",
    title: "Contact Me",
    subtitle: "Let's work together",
    nameLabel: "Name",
    namePlaceholder: "Your Name",
    emailLabel: "Email",
    emailPlaceholder: "Your Email",
    messageLabel: "Message",
    messagePlaceholder: "Tell me about your project...",
    sendBtn: "Send Message",
    sendingBtn: "Sending...",
    available: "Available for new projects",
    emailTitle: "Email",
    socialTitle: "Find me",
    copyEmail: "Copy email",
    copied: "Copied!",
    errors: {
      SEMUA_FIELD: "Please fill in all fields.",
      EMAIL_TIDAK_VALID: "Invalid email format.",
      TERLALU_PANJANG: "Content is too long.",
      TERLALU_SERING: "Too many attempts. Please try again later.",
      GAGAL_KIRIM: "Failed to send. Try again or email directly.",
      BELUM_KONFIGURASI: "Form not configured yet — please email directly.",
      UNKNOWN: "Something went wrong. Please try again.",
    } as Record<string, string>,
    successMsg: "Message sent! I'll get back to you soon.",
  },
};

const initialState: ContactFormState = { status: "idle" };

export default function ContactSection() {
  const { lang } = useLanguage();
  const t = content[lang];

  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.15 });
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard diblokir — biarkan, ada link mailto sebagai fallback */
    }
  };

  const errorText =
    state.status === "error"
      ? (t.errors[state.message ?? "UNKNOWN"] ?? t.errors.UNKNOWN)
      : null;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`contact-section container py-5 mb-5 scroll-margin-top ${isVisible ? "contact-visible" : ""}`}
    >
      <div className="section-title text-center mb-5">
        <div className="section-eyebrow">{t.eyebrow}</div>
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
      </div>

      <div className="row justify-content-center g-4">
        {/* Kolom kiri: info kontak */}
        <div className="col-lg-4 contact-info reveal-item">
          <span className="availability-chip">
            <span className="availability-dot" aria-hidden="true" />
            {t.available}
          </span>

          <h3 className="contact-info-title">{t.emailTitle}</h3>
          <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email-link">
            {CONTACT_EMAIL}
          </a>

          <button type="button" className="copy-email-btn" onClick={copyEmail}>
            {copied ? t.copied : t.copyEmail}
          </button>

          <h4 className="contact-social-title">{t.socialTitle}</h4>
          <div className="contact-social">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <i className="bi bi-github" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="bi bi-linkedin" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        {/* Kolom kanan: form */}
        <div className="col-lg-8 reveal-item">
          <div className="glass-card p-4 p-md-5">
            <form ref={formRef} action={formAction} noValidate={false}>
              {/* Honeypot — tersembunyi dari manusia, terisi bot. */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="contact-name">
                    {t.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    maxLength={120}
                    autoComplete="name"
                    className="form-control custom-input"
                    placeholder={t.namePlaceholder}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="contact-email">
                    {t.emailLabel}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    className="form-control custom-input"
                    placeholder={t.emailPlaceholder}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="contact-message">
                    {t.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    maxLength={5000}
                    className="form-control custom-input"
                    placeholder={t.messagePlaceholder}
                  ></textarea>
                </div>

                <div className="col-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-info btn-lg rounded-pill px-5 submit-btn"
                    disabled={isPending}
                    aria-busy={isPending}
                  >
                    {isPending ? t.sendingBtn : t.sendBtn}
                  </button>

                  <div className="form-status" role="status" aria-live="polite">
                    {errorText && (
                      <p className="form-status-error">{errorText}</p>
                    )}
                    {state.status === "success" && (
                      <p className="form-status-success">{t.successMsg}</p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
