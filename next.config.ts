import type { NextConfig } from "next";
import { mediaBaseUrl } from "./data/media";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 95],
    // Portfolio media never changes in place — a reworked piece gets a new file
    // name (see ASSETS.md). A long TTL therefore only ever saves work. Keep it
    // below a year so that an accidental same-name overwrite still heals.
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: [new URL("/portfolio/**", mediaBaseUrl)],
  },
  async headers() {
    return [
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
