# Portfolio

Static portfolio site built with [Astro](https://astro.build): dev projects,
photography albums, and embedded video. Deploys to GitHub Pages on every push
to `main`.

## Commands

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm install`     | Install dependencies                           |
| `npm run dev`     | Start the dev server at http://localhost:4321  |
| `npm run build`   | Build the production site into `dist/`         |
| `npm run preview` | Serve the built site locally                   |

## Make it yours

1. **Your details**: edit `src/site.config.ts` (name, tagline, email, social links).
2. **Fonts**: the theme is set for Forma DJR Display, Forma DJR Text, and Input Mono
   from Adobe Fonts. Create a web project at fonts.adobe.com with those families,
   add `ptcra.sh` and `localhost` to its domains, and paste the project ID into
   `adobeFontsKit` in `src/site.config.ts`. Until then the site falls back to
   Helvetica Neue and the system mono.
2. **Bio**: edit `src/pages/about.astro`.
3. **Favicon**: replace `public/favicon.svg` and `public/favicon.ico`.
4. **Colors**: the palette is a handful of CSS variables at the top of
   `src/styles/global.css`. Light and dark both come from the visitor's OS setting.

## Adding content

All content is Markdown with frontmatter, validated at build time by
`src/content.config.ts`. A bad field fails the build with a clear message
instead of shipping a broken page. Entries with `draft: true` are shown in dev
and hidden from the production build.

### Dev projects

Add `src/content/projects/<slug>.md`:

```md
---
title: Project name
description: One sentence, shown on cards and as the meta description.
date: 2026-08-01
tags: [TypeScript, Astro]
repo: https://github.com/you/project      # optional
demo: https://project.example.com         # optional
cover: ../../assets/covers/project.jpg    # optional, 16:9 looks best
featured: true                            # optional, pins it to the home page
---

Write-up in Markdown. Headings, code blocks, and images all work.
```

### Photography

Each album is a Markdown file plus a folder of images:

1. Put full-resolution JPEGs in `src/assets/photos/<album-id>/`. They are
   sorted by filename, so prefix with numbers to control order. The filename
   becomes the alt text and lightbox caption: `03-market-stall.jpg` reads as
   "market stall".
2. Add `src/content/photography/<album-id>.md` with the same id:

```md
---
title: Album title
description: Optional one-liner.
date: 2026-09-10
location: Lisbon                                   # optional
cover: ../../assets/photos/<album-id>/01-cover.jpg
---

Optional intro text in Markdown.
```

Astro generates resized WebP variants for the grid and the lightbox at build
time, so there is no need to pre-shrink anything. Large albums do slow the
build, so expect a minute or two for a few hundred photos.

**Sections.** Subfolders inside an album folder become titled sections with a
jump bar at the top of the page, ordered by folder name. Prefix folders with
numbers to control order, for example `01-rome`, `02-venice`. The section title
is derived from the folder name; use the optional `sections` field to override
spelling:

```md
sections:
  fussen: Füssen
```

**Originals.** Keep full-size originals out of the repo. Export or resize to
about 2400px on the long edge at JPEG quality 85 before dropping them in; that
is roughly 0.5 MB per photo and more than enough for a 2000px lightbox.

### Videography

Add `src/content/videography/<slug>.md`:

```md
---
title: Video title
description: Optional one-liner.
date: 2026-07-14
url: https://www.youtube.com/watch?v=XXXXXXXXXXX   # or a vimeo.com link
role: Director, editor                            # optional
thumbnail: ../../assets/video/poster.jpg          # optional for YouTube, recommended for Vimeo
featured: true                                    # optional, shows on the home page
---

Optional notes in Markdown.
```

Players are click-to-load: nothing is requested from YouTube or Vimeo until a
visitor presses play.

## Deploying to GitHub Pages

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes the site
   on every push to `main`.

`site` in `astro.config.mjs` is the custom domain and `public/CNAME` carries it
into every deploy, so GitHub Pages keeps serving at https://ptcra.sh. The
domain needs these DNS records at the registrar:

| Type  | Name | Value                                                                    |
| ----- | ---- | ------------------------------------------------------------------------ |
| A     | @    | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153       |
| AAAA  | @    | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| CNAME | www  | ptcrash.github.io                                                        |

To move off the custom domain, delete `public/CNAME` and set `site` and `base`
as the comment in `astro.config.mjs` describes.

## Layout

```
src/
  site.config.ts        Your name, tagline, links
  content.config.ts     Frontmatter schemas for the three collections
  content/
    projects/           One .md per dev project
    photography/        One .md per album
    videography/        One .md per video
  assets/
    photos/<album>/     Album images (auto-discovered)
    covers/             Project cover images
    video/              Video poster images
  components/           Header, Footer, cards, PhotoGrid (with lightbox), VideoEmbed
  layouts/Base.astro    HTML shell, meta tags, header and footer
  pages/                Routes
  styles/global.css     Design tokens and base styles
```
