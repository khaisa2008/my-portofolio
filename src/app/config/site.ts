/* URL dasar untuk SEO absolut (sitemap, robots, OpenGraph, canonical).
 * Set NEXT_PUBLIC_SITE_URL di .env.local saat deploy, mis.:
 *   NEXT_PUBLIC_SITE_URL=https://domain-anda.com
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Khaisa | Portofolio";
