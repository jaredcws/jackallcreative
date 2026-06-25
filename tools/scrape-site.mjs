import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const root = process.cwd();
const baseUrl = "https://www.jackallcreative.com";
const logoSource =
  "C:\\LocalStorage\\Cursor\\Jackall Creative\\logo and logo elements";

const scrapeDir = path.join(root, "content", "scrape");
const rawDir = path.join(scrapeDir, "raw-html");
const pageDir = path.join(scrapeDir, "pages");
const websiteImgDir = path.join(root, "website", "assets", "img");
const brandDir = path.join(websiteImgDir, "brand");
const portfolioDir = path.join(websiteImgDir, "portfolio");
const imageDbDir = path.join(scrapeDir, "images");
const imageOriginalDir = path.join(imageDbDir, "originals");
const imageByPageDir = path.join(imageDbDir, "by-page");

const fallbackPages = [
  `${baseUrl}/`,
  `${baseUrl}/our-work`,
  `${baseUrl}/photos`,
  `${baseUrl}/services`,
  `${baseUrl}/work-with-us`,
  `${baseUrl}/contact`,
  `${baseUrl}/blog`,
  `${baseUrl}/clients`,
  `${baseUrl}/client-portal`,
];

const priorityPages = [
  `${baseUrl}/`,
  `${baseUrl}/our-work`,
  `${baseUrl}/photos`,
  `${baseUrl}/services`,
  `${baseUrl}/work-with-us`,
  `${baseUrl}/contact`,
];

const brandAssets = [
  [
    "Jackall Creative Logo Board Final 202_Jackall Creative black Wordmark_Jackall Creative black Wordmark.png",
    "jackall-creative-wordmark-black.png",
  ],
  [
    "Jackall Creative Logo Board Final 202_Jackall Creative black Wordmark_Jackall Creative white Wordmark.png",
    "jackall-creative-wordmark-white.png",
  ],
  [
    "Jackall Creative Logo Board Final 202_Jackall Only black Wordmark.png",
    "jackall-wordmark-black.png",
  ],
  [
    "Jackall Creative Logo Board Final 202_howling head blue.png",
    "jackall-mark-blue.png",
  ],
  [
    "Jackall Creative Logo Board Final 202_howling head black.png",
    "jackall-mark-black.png",
  ],
  [
    "Jackall Creative Logo Board Final 202_jackall blue paw.png",
    "jackall-paw-blue.png",
  ],
  ["Jackall Creative Logo Board Final 2025.png", "jackall-script-yellow.png"],
];

const htmlEntities = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "-",
  mdash: "-",
  rsquo: "'",
  lsquo: "'",
  rdquo: '"',
  ldquo: '"',
};

function decodeHtml(value = "") {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&([a-z]+);/gi, (_, name) => htmlEntities[name] ?? `&${name};`);
}

function slugFor(url) {
  const parsed = new URL(url);
  const clean = parsed.pathname.replace(/^\/+|\/+$/g, "");
  return clean ? clean.replace(/[^a-z0-9]+/gi, "-").toLowerCase() : "home";
}

function uniqueSlugFor(url, slugCounts) {
  const baseSlug = slugFor(url);
  const count = slugCounts.get(baseSlug) || 0;
  slugCounts.set(baseSlug, count + 1);
  return count === 0 ? baseSlug : `${baseSlug}-${hashValue(url)}`;
}

function hashValue(value) {
  return createHash("sha1").update(value).digest("hex").slice(0, 10);
}

function sanitizeFilename(value) {
  return decodeURIComponent(value)
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 80);
}

function normalizeImageUrl(url) {
  const parsed = new URL(url);
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString();
}

function extensionForUrl(url) {
  const pathname = new URL(url).pathname;
  const ext = pathname.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  if (ext && ext.length <= 5) return ext === "jpeg" ? "jpg" : ext;
  return "jpg";
}

function filenameForImage(id, canonicalUrl) {
  const parsed = new URL(canonicalUrl);
  const ext = extensionForUrl(canonicalUrl);
  const basename = sanitizeFilename(path.basename(parsed.pathname, path.extname(parsed.pathname))) || "image";
  return `${String(id).padStart(3, "0")}-${basename}-${hashValue(canonicalUrl)}.${ext}`;
}

function titleFromHtml(html, fallback) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return decodeHtml(title || fallback).replace(/\s+/g, " ").trim();
}

function extractDescription(html) {
  const meta = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  );
  return decodeHtml(meta?.[1] || "").trim();
}

function extractText(html) {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/(h[1-6]|p|li|div|section|article|header|footer|br|blockquote)>/gi, "\n")
    .replace(/<(h[1-6]|p|li|div|section|article|header|footer|blockquote)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  const noisy = new Set([
    "0",
    "skip to content",
    "open menu close menu",
    "folder: contact us",
    "back",
    "contact us",
    "home",
    "our blog",
    "our work",
    "photography",
    "services",
    "work with us",
    "contact",
    "client portal",
  ]);

  const lines = decodeHtml(cleaned)
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((line) => !noisy.has(line.toLowerCase()));

  const deduped = [];
  for (const line of lines) {
    if (deduped[deduped.length - 1] !== line) deduped.push(line);
  }
  return deduped;
}

function extractLinks(html, pageUrl) {
  const links = [];
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = decodeHtml(match[1]).trim();
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) continue;
    const text = decodeHtml(match[2].replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    try {
      links.push({ text, url: new URL(href, pageUrl).toString() });
    } catch {
      // Keep crawling resilient against malformed CMS markup.
    }
  }
  return links;
}

function extractImages(html, pageUrl) {
  const images = new Map();
  const urlPattern =
    /https?:\/\/(?:images\.squarespace-cdn\.com|static1\.squarespace\.com)[^"'<>\s)]+/gi;

  for (const match of html.matchAll(urlPattern)) {
    const url = decodeHtml(match[0]).replace(/\\u0026/g, "&");
    if (/\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url)) {
      images.set(url, { url, alt: "" });
    }
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const src =
      tag.match(/\b(?:src|data-src)=["']([^"']+)["']/i)?.[1] ||
      tag.match(/\bsrcset=["']([^"']+)["']/i)?.[1]?.split(/\s+/)[0];
    if (!src) continue;
    try {
      const url = new URL(decodeHtml(src), pageUrl).toString();
      const alt = decodeHtml(tag.match(/\balt=["']([^"']*)["']/i)?.[1] || "");
      images.set(url, { url, alt });
    } catch {
      // Ignore malformed image references.
    }
  }

  return [...images.values()];
}

function markdownForPage(page) {
  const imageLines = page.images.map((image) => `- ${image.alt ? `${image.alt}: ` : ""}${image.url}`);
  const linkLines = page.links.map((link) =>
    `- ${link.text ? `${link.text}: ` : ""}${link.url}`,
  );

  return [
    `# ${page.title}`,
    "",
    `Source: ${page.url}`,
    page.description ? `Description: ${page.description}` : "",
    "",
    "## Extracted Text",
    "",
    ...page.text.map((line) => `- ${line}`),
    "",
    "## Links",
    "",
    ...(linkLines.length ? linkLines : ["- None found"]),
    "",
    "## Image Assets",
    "",
    ...(imageLines.length ? imageLines : ["- None found"]),
    "",
  ]
    .filter((line, index, arr) => line !== "" || arr[index - 1] !== "")
    .join("\n");
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 JackallCreativeRebuildBot/1.0 content migration",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 JackallCreativeRebuildBot/1.0" },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return Buffer.from(await response.arrayBuffer());
}

async function discoverPages() {
  try {
    const sitemap = await fetchText(`${baseUrl}/sitemap.xml`);
    const urls = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
      .map((match) => decodeHtml(match[1].trim()))
      .filter((url) => url.startsWith(baseUrl))
      .filter((url) => !/\.(jpg|jpeg|png|webp|gif|pdf|zip)$/i.test(new URL(url).pathname));
    return [...new Set([...priorityPages, ...urls])];
  } catch (error) {
    console.warn(`Sitemap discovery failed, using fallback pages: ${error.message}`);
    return fallbackPages;
  }
}

async function ensureDirs() {
  for (const dir of [
    scrapeDir,
    rawDir,
    pageDir,
    brandDir,
    portfolioDir,
    imageDbDir,
    imageOriginalDir,
    imageByPageDir,
  ]) {
    await mkdir(dir, { recursive: true });
  }
}

async function copyBrandAssets() {
  const copied = [];
  for (const [sourceName, destName] of brandAssets) {
    const source = path.join(logoSource, sourceName);
    const dest = path.join(brandDir, destName);
    if (!existsSync(source)) continue;
    await copyFile(source, dest);
    copied.push({ source, dest: path.relative(root, dest).replaceAll("\\", "/") });
  }
  return copied;
}

async function downloadPortfolioImages(assetManifest) {
  const seen = new Set();
  const selected = [];

  const priority = assetManifest
    .filter((asset) => priorityPages.includes(asset.pageUrl))
    .concat(assetManifest.filter((asset) => !priorityPages.includes(asset.pageUrl)));

  for (const asset of priority) {
    const url = asset.url.split("?")[0];
    if (seen.has(url)) continue;
    seen.add(url);
    if (!/\.(jpg|jpeg|png|webp)$/i.test(url)) continue;
    selected.push(asset.url);
    if (selected.length >= 18) break;
  }

  const downloaded = [];
  let index = 1;
  for (const url of selected) {
    const ext = new URL(url).pathname.match(/\.(jpg|jpeg|png|webp)$/i)?.[1] || "jpg";
    const filename = `portfolio-${String(index).padStart(2, "0")}.${ext.toLowerCase()}`;
    const dest = path.join(portfolioDir, filename);
    try {
      const buffer = await fetchBuffer(url);
      await writeFile(dest, buffer);
      downloaded.push({ source: url, dest: path.relative(root, dest).replaceAll("\\", "/") });
      index += 1;
    } catch (error) {
      console.warn(`Could not download ${url}: ${error.message}`);
    }
  }
  return downloaded;
}

function buildImageDatabase(assetManifest) {
  const images = new Map();

  for (const asset of assetManifest) {
    const canonicalUrl = normalizeImageUrl(asset.url);
    if (!images.has(canonicalUrl)) {
      images.set(canonicalUrl, {
        id: images.size + 1,
        canonicalUrl,
        variants: new Set(),
        pages: new Map(),
        altTexts: new Set(),
      });
    }

    const image = images.get(canonicalUrl);
    image.variants.add(asset.url);
    if (asset.alt) image.altTexts.add(asset.alt);

    if (!image.pages.has(asset.pageUrl)) {
      image.pages.set(asset.pageUrl, {
        title: asset.pageTitle,
        url: asset.pageUrl,
        slug: asset.pageSlug,
        altTexts: new Set(),
      });
    }
    if (asset.alt) image.pages.get(asset.pageUrl).altTexts.add(asset.alt);
  }

  return [...images.values()].map((image) => {
    const fileName = filenameForImage(image.id, image.canonicalUrl);
    return {
      id: image.id,
      canonicalUrl: image.canonicalUrl,
      fileName,
      relativePath: path
        .relative(root, path.join(imageOriginalDir, fileName))
        .replaceAll("\\", "/"),
      variants: [...image.variants].sort(),
      altTexts: [...image.altTexts].sort(),
      pages: [...image.pages.values()]
        .map((page) => ({
          title: page.title,
          url: page.url,
          slug: page.slug,
          altTexts: [...page.altTexts].sort(),
        }))
        .sort((a, b) => a.slug.localeCompare(b.slug)),
    };
  });
}

async function downloadImageDatabase(imageRecords) {
  const downloaded = [];
  const failed = [];

  for (const image of imageRecords) {
    const dest = path.join(root, image.relativePath);
    if (existsSync(dest)) {
      downloaded.push({ ...image, skippedExisting: true });
      continue;
    }

    const candidates = [
      image.canonicalUrl,
      ...image.variants.filter((variant) => variant !== image.canonicalUrl),
    ].sort((a, b) => {
      const score = (url) => {
        if (url === image.canonicalUrl) return 0;
        if (url.includes("format=2500w")) return 1;
        if (url.includes("format=1500w")) return 2;
        if (url.includes("format=1000w")) return 3;
        return 4;
      };
      return score(a) - score(b);
    });

    let lastError = null;
    try {
      for (const candidate of candidates) {
        try {
          const buffer = await fetchBuffer(candidate);
          await writeFile(dest, buffer);
          downloaded.push({
            ...image,
            bytes: buffer.length,
            skippedExisting: false,
            downloadedFrom: candidate,
          });
          await new Promise((resolve) => setTimeout(resolve, 75));
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (lastError) throw lastError;
    } catch (error) {
      failed.push({
        id: image.id,
        canonicalUrl: image.canonicalUrl,
        error: error.message,
      });
      console.warn(`Could not download image ${image.id}: ${image.canonicalUrl} - ${error.message}`);
    }
  }

  return { downloaded, failed };
}

async function writeImageDatabase(imageRecords, downloadResult) {
  const downloadedById = new Map(
    downloadResult.downloaded.map((image) => [image.id, image]),
  );
  const failedById = new Map(downloadResult.failed.map((image) => [image.id, image]));

  const records = imageRecords.map((image) => ({
    ...image,
    status: failedById.has(image.id) ? "failed" : "downloaded",
    error: failedById.get(image.id)?.error || null,
    bytes: downloadedById.get(image.id)?.bytes || null,
    skippedExisting: downloadedById.get(image.id)?.skippedExisting || false,
  }));

  await writeFile(
    path.join(imageDbDir, "image-database.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: baseUrl,
        totalSourceImages: records.length,
        totalReferences: records.reduce((sum, image) => sum + image.variants.length, 0),
        downloaded: records.filter((image) => image.status === "downloaded").length,
        failed: records.filter((image) => image.status === "failed").length,
        records,
      },
      null,
      2,
    ),
    "utf8",
  );

  const markdown = [
    "# Jackall Creative Complete Image Database",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Source: ${baseUrl}`,
    "",
    `Source images downloaded: ${records.filter((image) => image.status === "downloaded").length}`,
    `Failed downloads: ${records.filter((image) => image.status === "failed").length}`,
    `Original image references indexed: ${records.reduce((sum, image) => sum + image.variants.length, 0)}`,
    "",
    "## Images",
    "",
    ...records.flatMap((image) => [
      `### ${String(image.id).padStart(3, "0")} - ${image.fileName}`,
      "",
      `- Status: ${image.status}`,
      `- Local file: ${image.relativePath}`,
      `- Source: ${image.canonicalUrl}`,
      `- Referenced on: ${image.pages.map((page) => page.slug).join(", ")}`,
      `- Variant URLs: ${image.variants.length}`,
      "",
    ]),
  ].join("\n");

  await writeFile(path.join(imageDbDir, "image-database.md"), markdown, "utf8");

  const byPage = new Map();
  for (const image of records) {
    for (const page of image.pages) {
      if (!byPage.has(page.slug)) {
        byPage.set(page.slug, { page, images: [] });
      }
      byPage.get(page.slug).images.push(image);
    }
  }

  for (const { page, images } of byPage.values()) {
    const pageMarkdown = [
      `# Images Used On ${page.title}`,
      "",
      `Source page: ${page.url}`,
      `Image count: ${images.length}`,
      "",
      ...images.flatMap((image) => [
        `## ${String(image.id).padStart(3, "0")} - ${image.fileName}`,
        "",
        `![${image.altTexts[0] || image.fileName}](../originals/${image.fileName})`,
        "",
        `- Local file: ../originals/${image.fileName}`,
        `- Source: ${image.canonicalUrl}`,
        `- Variant URLs: ${image.variants.length}`,
        "",
      ]),
    ].join("\n");
    await writeFile(path.join(imageByPageDir, `${page.slug}.md`), pageMarkdown, "utf8");
  }

  const galleryCards = records
    .map((image) => {
      const src = `originals/${image.fileName}`;
      const pages = image.pages.map((page) => page.slug).join(", ");
      return `<article><img src="${src}" alt=""><h2>${String(image.id).padStart(3, "0")} ${image.fileName}</h2><p>${pages}</p><a href="${image.canonicalUrl}">Source</a></article>`;
    })
    .join("\n");

  await writeFile(
    path.join(imageDbDir, "gallery.html"),
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Jackall Creative Image Database</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f4f1ea; color: #231f20; }
    header { padding: 32px; background: #231f20; color: white; }
    main { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; padding: 16px; }
    article { background: white; border: 1px solid #d8d2c8; border-radius: 8px; overflow: hidden; }
    img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: #ddd; display: block; }
    h2 { font-size: 13px; line-height: 1.35; margin: 12px 12px 4px; overflow-wrap: anywhere; }
    p, a { font-size: 12px; margin: 8px 12px 12px; color: #4a4542; overflow-wrap: anywhere; }
    a { display: block; color: #1f9bd1; }
  </style>
</head>
<body>
  <header>
    <h1>Jackall Creative Image Database</h1>
    <p>${records.length} normalized source images from ${baseUrl}</p>
  </header>
  <main>${galleryCards}</main>
</body>
</html>
`,
    "utf8",
  );

  return records;
}

async function main() {
  await ensureDirs();

  const urls = await discoverPages();
  const pages = [];
  const assetManifest = [];
  const slugCounts = new Map();

  for (const url of urls) {
    try {
      const html = await fetchText(url);
      const slug = uniqueSlugFor(url, slugCounts);
      const page = {
        url,
        slug,
        title: titleFromHtml(html, slug),
        description: extractDescription(html),
        text: extractText(html),
        links: extractLinks(html, url),
        images: extractImages(html, url),
      };

      pages.push(page);
      for (const image of page.images) {
        assetManifest.push({
          pageTitle: page.title,
          pageUrl: page.url,
          pageSlug: page.slug,
          alt: image.alt,
          url: image.url,
        });
      }

      await writeFile(path.join(rawDir, `${slug}.html`), html, "utf8");
      await writeFile(path.join(pageDir, `${slug}.md`), markdownForPage(page), "utf8");
      await new Promise((resolve) => setTimeout(resolve, 120));
    } catch (error) {
      console.warn(`Could not scrape ${url}: ${error.message}`);
    }
  }

  const uniqueAssets = [
    ...new Map(assetManifest.map((asset) => [asset.url, asset])).values(),
  ];
  const imageRecords = buildImageDatabase(assetManifest);
  const downloadedDatabase = await downloadImageDatabase(imageRecords);
  const imageDatabaseRecords = await writeImageDatabase(imageRecords, downloadedDatabase);
  const copiedBrand = await copyBrandAssets();
  const downloadedPortfolio = await downloadPortfolioImages(uniqueAssets);

  const summary = {
    generatedAt: new Date().toISOString(),
    source: baseUrl,
    pageCount: pages.length,
    pages: pages.map((page) => ({
      title: page.title,
      url: page.url,
      slug: page.slug,
      textLineCount: page.text.length,
      linkCount: page.links.length,
      imageCount: page.images.length,
    })),
    assetCount: uniqueAssets.length,
    normalizedImageCount: imageDatabaseRecords.length,
    downloadedImageCount: imageDatabaseRecords.filter((image) => image.status === "downloaded")
      .length,
    failedImageCount: imageDatabaseRecords.filter((image) => image.status === "failed").length,
    assets: uniqueAssets,
    imageDatabase: path.relative(root, path.join(imageDbDir, "image-database.json")).replaceAll("\\", "/"),
    copiedBrand,
    downloadedPortfolio,
  };

  await writeFile(
    path.join(scrapeDir, "scrape-summary.json"),
    JSON.stringify(summary, null, 2),
    "utf8",
  );

  const assetMarkdown = [
    "# Current Website Asset Inventory",
    "",
    `Source: ${baseUrl}`,
    `Generated: ${summary.generatedAt}`,
    "",
    `Total unique image assets found: ${uniqueAssets.length}`,
    `Normalized source images downloaded: ${summary.downloadedImageCount}`,
    `Normalized source image download failures: ${summary.failedImageCount}`,
    `Downloaded portfolio images for the rebuild: ${downloadedPortfolio.length}`,
    `Copied brand assets: ${copiedBrand.length}`,
    "",
    "## Downloaded Portfolio Images",
    "",
    ...downloadedPortfolio.map((asset) => `- ${asset.dest} from ${asset.source}`),
    "",
    "## Copied Brand Assets",
    "",
    ...copiedBrand.map((asset) => `- ${asset.dest}`),
    "",
    "## Source Image URLs",
    "",
    ...uniqueAssets.map((asset) => `- ${asset.pageTitle}: ${asset.url}`),
    "",
  ].join("\n");

  await writeFile(path.join(scrapeDir, "asset-inventory.md"), assetMarkdown, "utf8");

  console.log(
    `Scraped ${pages.length} pages, found ${uniqueAssets.length} image assets, downloaded ${downloadedPortfolio.length} portfolio images, copied ${copiedBrand.length} brand assets.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
