# Jackall Creative Static Website

This folder contains the Cloudflare-ready static website.

## Local Commands

```bash
npm run build
```

The build command copies the static site into `dist/` and validates local HTML asset references.

## Cloudflare Pages

- Project root: `website`
- Build command: `npm run build`
- Output directory: `dist`

Direct upload option: upload the contents of `dist/`.

## Contact Form

The contact form is static and opens a pre-filled email to `jackallcreative@gmail.com`, which was found in the current site scrape. A Cloudflare Worker or third-party form endpoint can replace this later without changing the page design.

## Original Notes

This folder is reserved for the approved Cloudflare-ready Jackall Creative website build.

Recommended final deployment target:

- Host: Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`

The approved build should include:

- Static pages
- Optimized assets
- SEO metadata
- Sitemap and robots.txt
- Contact form integration
- Cloudflare analytics or equivalent
