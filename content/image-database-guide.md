# Jackall Creative Image Database Guide

Generated from `https://www.jackallcreative.com` on June 25, 2026.

## What Was Captured

- Current site pages scraped: 123
- Raw image references indexed from HTML: 1,922
- Normalized source image assets identified: 312
- Source image assets downloaded successfully: 309
- Legacy CDN references returning 404: 3
- Downloaded source image storage: `content/scrape/images/originals/`
- Searchable database: `content/scrape/images/image-database.json`
- Human-readable index: `content/scrape/images/image-database.md`
- Visual gallery: `content/scrape/images/gallery.html`
- Per-page image indexes: `content/scrape/images/by-page/`

## Deduplication Method

Squarespace publishes the same image many times with generated size variants such as `?format=100w`, `?format=750w`, and `?format=2500w`.

The database preserves all 1,922 referenced URLs, but downloads each normalized source image once by removing generated format query strings. This gives us a complete local image library without storing duplicate size variants.

## Unavailable Legacy Files

The current HTML still references three old brand-pattern files that Squarespace no longer serves. Their URLs and page usage are preserved in `image-database.json` with `status: "failed"`.

- `Jackall Creative Logo pattern-01-01.png` on `service-options`
- `Jackall Creative Jackal Head Logo pattern-01.png` on `new-business-checklist`
- `jackall head patterns_white.png` on `donated-service-application`

Current logo and brand elements from the local brand folder were copied separately into `website/assets/img/brand/`, so the new site still has usable current brand marks and pattern material.

## Recommended Use

Use `gallery.html` for fast visual scanning, then use `image-database.json` to trace an image back to its original source URL and page usage.

For the production website, use a curated subset of these images in `website/assets/img/` and optimize further if a page needs many images.
