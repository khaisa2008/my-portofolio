import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import "./animation/RobotHead.css";
import "./animation/AngryRobot.css";
import "./animation/DizzyRobot.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { LanguageProvider } from "@/app/contexts/LanguageContext";
import { SITE_NAME, SITE_URL } from "@/app/config/site";

// Inisialisasi Inter Font dari Next.js
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description:
    "Modern portfolio built with Next.js — skills, projects, and contact.",
  keywords: [
    "portfolio",
    "next.js",
    "frontend developer",
    "web developer",
    "Khaisa",
  ],
  icons: {
    icon: "/exemple.png",
  },
  openGraph: {
    title: SITE_NAME,
    description:
      "Modern portfolio built with Next.js — skills, projects, and contact.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Modern portfolio built with Next.js — skills, projects, and contact.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>

      <Script
        id="theme-init"
        dangerouslySetInnerHTML={{
          __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark-theme');
                  } else {
                    document.documentElement.classList.remove('dark-theme');
                  }
                } catch (e) {}
              })();
            `,
        }}
      />
    </html>
  );
}
