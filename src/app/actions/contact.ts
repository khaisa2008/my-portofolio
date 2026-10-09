"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

/* Rate-limit sederhana in-memory: 5 submit / IP / 10 menit.
 * Cukup untuk portfolio pribadi; untuk skala besar pakai Redis/KV. */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_HITS;
}

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  /* Honeypot: bot mengisi field tersembunyi ini, manusia tidak. */
  const website = String(formData.get("website") ?? "").trim();

  if (website) {
    /* Bisa jadi bot — pura-pura sukses supaya bot tidak mengulang. */
    return { status: "success" };
  }

  if (!name || !email || !message) {
    return { status: "error", message: "SEMUA_FIELD" };
  }
  if (name.length > MAX_NAME || email.length > MAX_EMAIL) {
    return { status: "error", message: "TERLALU_PANJANG" };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "EMAIL_TIDAK_VALID" };
  }
  if (message.length > MAX_MESSAGE) {
    return { status: "error", message: "TERLALU_PANJANG" };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "TERLALU_SERING" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Konfigurasi belum lengkap — jangan buang pesan senyap.
    console.error(
      "[contact] Resend belum dikonfigurasi (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL)",
    );
    return { status: "error", message: "BELUM_KONFIGURASI" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio — pesan dari ${name}`,
      text: `Nama: ${name}\nEmail: ${email}\n\n${message}\n`,
      html: `
        <div style="font-family:sans-serif;line-height:1.6">
          <h2 style="margin:0 0 8px">Pesan baru dari portfolio</h2>
          <p style="margin:0 0 4px"><strong>Nama:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:12px 0" />
          <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return { status: "error", message: "GAGAL_KIRIM" };
    }

    return { status: "success" };
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return { status: "error", message: "GAGAL_KIRIM" };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
