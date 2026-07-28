import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./animation/splash.css";
import "./animation/RobotHead.css";
import "./animation/AngryRobot.css";
import "./animation/DizzyRobot.css";
// import "./animation/HomeSection.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { LanguageProvider } from "@/app/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khaisa | Portofolio",
  description: "Modern portfolio built with Next.js",
  icons: {
    icon: "/exemple.png",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>{" "}
        </ThemeProvider>
      </body>
    </html>
  );
}
