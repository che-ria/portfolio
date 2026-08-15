# Portfolio media

Portfolio images and the CV are not stored in Git. Store them in an object-storage bucket with CDN delivery. Cloudflare R2 is a good no-cost option for this portfolio: the current free tier includes 10 GB-month of Standard storage, 1 million writes, 10 million reads per month, and free egress. The current local media is about 644 MiB, so it fits comfortably if traffic stays within the request allowance. [R2 pricing](https://developers.cloudflare.com/r2/pricing/)

Keep the same directory layout as the paths below, so existing portfolio metadata keeps working:

```text
portfolio/
  projects/<project-slug>/{cover,logo,gallery}/...
  illustrations/...
  marketing-art/...
  profile/icon.png
  cv.pdf
art/...
```

Set this variable in `.env.local` for development and in the hosting provider's production environment:

```dotenv
NEXT_PUBLIC_MEDIA_BASE_URL=https://media.example.com
```

The value is the origin only: no trailing slash and no `/portfolio` suffix. With it set, every image and CV link is served from the CDN. Without it, the app uses matching files in `public/`, which is convenient for a local temporary copy.

`public/portfolio/` and `public/art/` are ignored by Git. After the files have been uploaded and the deployment environment variable is set, remove already tracked assets from Git while retaining local copies:

```powershell
git rm -r --cached public/portfolio public/art
git commit -m "Move portfolio media to object storage"
```

Use immutable names for new uploads (for example, `cover.3f14c2.webp`) or enable versioned object URLs. The CDN can then cache media for a year safely; updating an image means changing the filename/reference instead of fighting browser or CDN caches.

For a no-cost initial setup, create an R2 bucket, upload the folders above, and enable its public development URL. It is rate-limited and intended for development; for the public site, connect a custom subdomain you already own (for example, `media.your-domain.com`). [Cloudflare's public-bucket guide](https://developers.cloudflare.com/r2/buckets/public-buckets/)
