# Daryna Chernysheva — Portfolio

Next.js 16 (App Router) portfolio site. Every route is statically prerendered;
there is no database and no server-side data fetching.

## Local development

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev
```

Without `.env.local` the site looks for images under `public/portfolio/`. Drop a
copy of the media library there to work offline, or set
`NEXT_PUBLIC_MEDIA_BASE_URL` to pull from the CDN instead. Media is never
committed — see [ASSETS.md](ASSETS.md).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve a production build locally |
| `npm run lint` | ESLint |
| `npm run clean` | Delete `.next/` (only needed to force a cold build) |

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project** and import it. The framework preset,
   build command and output directory are all detected automatically.
3. Add the environment variables from `.env.example` under
   **Settings → Environment Variables** (Production and Preview):
   - `NEXT_PUBLIC_MEDIA_BASE_URL` — the R2 media origin
   - `NEXT_PUBLIC_SITE_URL` — only needed once a custom domain is attached;
     otherwise the production URL is detected automatically
4. Deploy.

Do not add a `prebuild` step that deletes `.next/`. Vercel restores `.next/cache`
between builds, and wiping it forces a full re-optimization of every image on
every deploy.

## Structure

```text
app/            routes; each page is a Server Component
  layout.tsx      shell, fonts, metadata
  page.tsx        project grid (home)
  projects/[slug] project galleries, prerendered via generateStaticParams
  robots.ts       generated robots.txt
  sitemap.ts      generated sitemap.xml
components/     ProjectGallery is the only stateful (client) component
data/
  site.ts         the image catalogue — server-only, never bundled for browsers
  navigation.ts   nav links; kept separate because client components import it
  media.ts        resolves a path to the CDN or to public/
  site-url.ts     canonical origin for metadata
```

`data/navigation.ts` exists so `Header` and `Footer` — both Client Components —
can import the nav without dragging the whole image catalogue into the browser
bundle.

## Notes for future changes

- **Adding a project**: add an entry to `projectMeta` in `data/site.ts`, then a
  gallery under `projectImages` with the same slug. Upload the files to R2 under
  the matching path. The route, sitemap entry and prev/next navigation follow
  automatically.
- **`sizes` on `next/image`** must describe the slot the image really occupies.
  Overstating it makes browsers download 2–4x more than needed. Use plain px or a
  bare `100vw` — next/image cannot parse `calc(50vw - 1rem)` when trimming the
  srcset, and silently emits candidates down to 32 px wide.
- **Replacing an image** means uploading under a new filename; caches are
  configured to treat media as immutable.
