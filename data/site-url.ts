/**
 * Canonical origin of the deployed site, used for `metadataBase`, the sitemap
 * and robots.txt. Vercel exposes `VERCEL_PROJECT_PRODUCTION_URL` (the stable
 * production domain) on every deployment, so previews still emit production
 * URLs rather than their own throwaway hostnames.
 */
const configured = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined)
  ?? "http://localhost:3000";

export const siteUrl = configured.replace(/\/$/, "");
