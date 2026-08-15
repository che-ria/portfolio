import type { NextConfig } from "next";

const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;

const immutable = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 95],
    // Portfolio media never changes in place — a reworked piece gets a new file
    // name (see ASSETS.md). A long TTL therefore only ever saves work. Keep it
    // below a year so that an accidental same-name overwrite still heals.
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: mediaBaseUrl ? [new URL("/portfolio/**", mediaBaseUrl)] : [],
  },
  async headers() {
    return [
      {
        // The paper texture is a page background on every route, so it is
        // requested on the very first paint. Next serves `public/` with
        // `max-age=0` by default, which means a revalidation round-trip per
        // navigation for a 1.7 MB file.
        source: "/textures/:path*",
        headers: [{ key: "Cache-Control", value: immutable }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
