"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";

const content = {
  ID: {
    title: "Hubungi Saya",
    subtitle: "Mari bekerja sama",
    namePlaceholder: "Nama Anda",
    emailPlaceholder: "Email Anda",
    messagePlaceholder: "Pesan Anda",
    sendBtn: "Kirim Pesan",
  },
  EN: {
    title: "Contact Me",
    subtitle: "Let's work together",
    namePlaceholder: "Your Name",
    emailPlaceholder: "Your Email",
    messagePlaceholder: "Your Message",
    sendBtn: "Send Message",
  },
};

export default function ContactSection() {
  const { lang } = useLanguage();
  const t = content[lang];

  return (
    <section id="contact" className="container py-5 mb-5 scroll-margin-top">
      <div className="section-title text-center mb-5">
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-card p-5">
            <div className="row g-4">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control custom-input"
                  placeholder={t.namePlaceholder}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control custom-input"
                  placeholder={t.emailPlaceholder}
                />
              </div>

              <div className="col-12">
                <textarea
                  rows={5}
                  className="form-control custom-input"
                  placeholder={t.messagePlaceholder}
                ></textarea>
              </div>

              <div className="col-12 text-center">
                <button className="btn btn-info btn-lg rounded-pill px-5">
                  {t.sendBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}