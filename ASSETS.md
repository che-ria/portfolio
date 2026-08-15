# Portfolio media

Portfolio images and the CV are **not** stored in Git. The repository holds code
plus one 75 KB paper texture; everything else is served from object storage with
a CDN in front.

## Why not Git

The media library is ~644 MiB of high-resolution PNG/JPG. Git stores every
version of every binary forever, so committing it means each clone downloads the
full history, pushes get slow, and GitHub starts warning above 1 GB. Object
storage also gives something Git cannot: a CDN edge close to the viewer.

## Storage: Cloudflare R2

R2 is the recommended target because **egress is free**. That is the property
that matters here — a portfolio is almost all outbound image traffic, and it is
what makes every other "cheap" S3-compatible host expensive at scale.

Current free tier: 10 GB-month storage, 1 million writes/month, 10 million
reads/month, unlimited egress. The library fits with room to spare.
[R2 pricing](https://developers.cloudflare.com/r2/pricing/)

### One-time setup

1. Create an R2 bucket (for example `dc-portfolio-media`) in the Cloudflare
   dashboard.
2. Upload the folders using the layout below. For bulk uploads use `rclone` or
   the `wrangler r2 object put` CLI rather than the dashboard.
3. Connect a **custom domain** to the bucket, e.g. `media.your-domain.com`.
   R2's built-in `*.r2.dev` development URL is rate-limited and explicitly not
   meant for production traffic.
   [Public bucket guide](https://developers.cloudflare.com/r2/buckets/public-buckets/)

### Directory layout

Keep these paths exactly — the portfolio metadata in `data/site.ts` is built
from them.

```text
portfolio/
  projects/<project-slug>/cover/...
  projects/<project-slug>/logo/...
  projects/<project-slug>/gallery/...
  illustrations/...
  marketing-art/...
  profile/icon.png
  profile/contact.jpg
  cv.pdf
```

### Connected bucket

The site uses `https://pub-9f988e3ef4e845fdb2e4f9c57ab4b44b.r2.dev` directly,
configured in `data/media.ts`. Every portfolio image and the CV link resolve to
this origin; the application has no local-media fallback. `next.config.ts`
allows Next Image Optimization only for its `/portfolio/**` path.

## Caching

Two independent layers, both already configured:

- **CDN → browser.** R2 sends `Cache-Control` from object metadata. Set
  `public, max-age=31536000, immutable` on upload.
- **Optimizer cache.** `images.minimumCacheTTL` is 31 days in `next.config.ts`,
  so a resized variant is generated once and reused.

Because both layers cache hard, **treat uploaded files as immutable**. To replace
a piece, upload it under a new name (`cover.v2.png`, or a content hash such as
`cover.3f14c2.png`) and update the reference in `data/site.ts`. Overwriting a
file in place leaves stale copies in CDN and browser caches for up to a month.

## What the app already does

You do not need to pre-resize anything. `next/image` requests a width that
matches the slot the image occupies and re-encodes to AVIF/WebP on demand:

| Slot | Delivered |
| --- | --- |
| Project grid tile, 1x desktop | 640 px AVIF (~40 KB from a 9 MB PNG) |
| Project grid tile, 2x desktop | 1920 px AVIF |
| Lightbox (zoomable to 4x) | 3840 px AVIF (~500 KB) |

Upload the **originals**. Downscaling them before upload only costs quality —
the optimizer will not upscale, so a small source caps how sharp the lightbox
can ever be.

### If the image-optimization allowance runs out

Vercel's Hobby plan caps how many unique source images may be optimized per
month; check the current number on your account's usage page. This portfolio has
roughly 350 unique images, and each is optimized once and then cached, so a
normal month stays inside it — but if you do hit the cap, the escape hatch is to
pre-generate the derivatives at upload time and point `next/image` straight at
them with a [custom loader](https://nextjs.org/docs/app/api-reference/config/next-config-js/images),
which removes the runtime optimizer from the path entirely.
