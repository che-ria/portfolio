# Portfolio asset structure

All final portfolio media lives in `public/portfolio/`. Keep file and folder names lowercase, use hyphens instead of spaces, and avoid Cyrillic characters in paths.

```text
public/portfolio/
├── projects/
│   ├── cozy-tiny-home/
│   │   ├── cover/
│   │   │   └── cover.webp
│   │   └── gallery/
│   │       ├── 01-opening.webp
│   │       ├── 02-process.webp
│   │       └── 03-final.webp
│   └── cottonville/
│       ├── cover/
│       ├── logo/
│       │   └── logo.png
│       └── gallery/
├── illustrations/
│   ├── illustration-name.webp
│   └── another-work.webp
└── profile/
    └── portrait.webp
```

## Project assets

- Give every project a unique slug such as `character-design`, `short-comic`, or `game-concept`.
- Put one landscape cover in `cover/`. A 16:9 image around 1600×900 px is ideal.
- Put the transparent project logo in `logo/logo.png` when a card should use artwork instead of a text title.
- Put all project images in `gallery/` in their intended reading order.
- Prefix gallery filenames with `01-`, `02-`, `03-`, and so on.
- Use `.webp` or `.avif` for finished web assets. `.png` is useful when transparency is required.
- Do not place source `.psd`, `.clip`, `.ai`, or very large print files in `public/`.

Public paths begin after the `public` directory. For example:

```ts
cover: "/portfolio/projects/character-design/cover/cover.webp"
logo: "/portfolio/projects/character-design/logo/logo.png"

{ src: "/portfolio/projects/character-design/gallery/01-sketches.webp", ... }
```

Project names, covers, descriptions, and gallery order are registered in `data/site.ts`.

## Personal illustrations

Put standalone personal pieces in `public/portfolio/illustrations/`. Their titles, alt text, and orientation are registered in the `artworks` array in `data/site.ts`.

## Profile image

Put the final portrait or self-portrait in `public/portfolio/profile/portrait.webp`, then update its path in `components/Header.tsx` and `app/contact/page.tsx`.
