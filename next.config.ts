import type { NextConfig } from "next";
import { mediaBaseUrl } from "./data/media";

const YEAR = 31536000;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Two qualities, each tied to a slot that already uses its own width, so the
    // pair costs no extra entries in the optimizer cache: 75 for grid tiles and
    // the lightbox preview, 88 for the full-resolution lightbox layer where the
    // artwork is the whole point of the screen.
    qualities: [75, 88],
    // Fitted to the slots this site actually has rather than left at the generic
    // default, because a candidate list only helps where it has a rung near the
    // requested width — the browser takes the next one *up*, and everything
    // above the slot is downloaded and thrown away. The rungs that matter:
    //   448  — masonry tile (~400px) at 1x, which the default list rounded to 640
    //   640  — grid tile (~610px) at 1x, phone at 1x
    //   828  — masonry wide tile (~810px) at 1x, phone at 2x
    //   1280 — full-width row (1220px) at 1x and grid tile at 2x, which the
    //          default list rounded all the way to 1920
    //   1536 — the lightbox on a 1440/1536-wide laptop, the single heaviest
    //          download on the site
    //   2560 — full-width row at 2x
    //   3840 — the lightbox at 2x
    //
    // 448 has to live here rather than in `imageSizes`: whenever a `sizes` string
    // contains a `vw` token, next/image keeps only candidates at or above
    // `deviceSizes[0] × smallest-vw` and drops every `imageSizes` entry
    // (see `getWidths` in next/dist/shared/lib/get-img-props.js). Since these
    // galleries are one column on phones, they all carry `100vw` — so anything
    // below the first device size is unreachable for them.
    deviceSizes: [448, 640, 828, 1080, 1280, 1536, 1920, 2560, 3840],
    // Reached only by slots declared purely in px, such as the header avatar.
    imageSizes: [128, 256, 384],
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
      {
        // The paper texture is the one image every page paints immediately and
        // the only one not served through the optimizer, so it gets the
        // immutable treatment by hand. Renaming the file is how it is replaced.
        source: "/textures/:path*",
        headers: [{ key: "Cache-Control", value: `public, max-age=${YEAR}, immutable` }],
      },
    ];
  },
};

export default nextConfig;
