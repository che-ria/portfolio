/**
 * Canonical origin of the deployed site, used for `metadataBase`, the sitemap
 * and robots.txt. Vercel exposes `VERCEL_PROJECT_PRODUCTION_URL` (the stable
 * production domain) on every deployment, so previews still emit production
 * URLs rather than their own throwaway hostnames.
 */
function validHttpUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href.replace(/\/$/, "")
      : undefined;
  } catch {
    return undefined;
  }
}

export const siteUrl = validHttpUrl(process.env.NEXT_PUBLIC_SITE_URL)
  ?? validHttpUrl(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
  )
  ?? "http://localhost:3000";
