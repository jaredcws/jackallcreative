import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const staticEntries = [
  "index.html",
  "ai-consulting.html",
  "creative-services.html",
  "work.html",
  "resources.html",
  "contact.html",
  "assets",
  "_headers",
  "_redirects",
  "robots.txt",
  "sitemap.xml",
];

async function copyStaticFiles() {
  try {
    await rm(dist, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
  } catch (error) {
    console.warn(`Could not fully clean dist (${error.code}); overwriting files in place.`);
  }
  await mkdir(dist, { recursive: true });

  for (const entry of staticEntries) {
    const source = path.join(root, entry);
    if (!existsSync(source)) {
      throw new Error(`Missing static entry: ${entry}`);
    }
    await copyEntry(source, path.join(dist, entry));
  }
}

async function copyEntry(source, destination) {
  const info = await stat(source);
  if (info.isDirectory()) {
    await mkdir(destination, { recursive: true });
    const entries = await readdir(source);
    for (const entry of entries) {
      await copyEntry(path.join(source, entry), path.join(destination, entry));
    }
    return;
  }

  await mkdir(path.dirname(destination), { recursive: true });
  const data = await readFile(source);
  await writeFile(destination, data);
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function validateHtmlReferences() {
  const localFiles = (await listFiles(dist)).filter((file) =>
    file.endsWith(".html") || file.endsWith(".css"),
  );
  const missing = [];

  for (const file of localFiles) {
    const source = await readFile(file, "utf8");
    const attrRefs = [...source.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)].map(
      (match) => match[1],
    );
    const cssRefs = [...source.matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map(
      (match) => match[2],
    );
    const refs = [...attrRefs, ...cssRefs]
      .filter((ref) => !ref.startsWith("http"))
      .filter((ref) => !ref.startsWith("mailto:"))
      .filter((ref) => !ref.startsWith("tel:"))
      .filter((ref) => !ref.startsWith("#"));

    for (const ref of refs) {
      const clean = ref.split("#")[0].split("?")[0];
      if (!clean) continue;
      const target = path.join(dist, clean.replace(/^\//, ""));
      if (!existsSync(target)) {
        missing.push(`${path.relative(dist, file)} -> ${ref}`);
      }
    }
  }

  if (missing.length) {
    throw new Error(`Missing local references:\n${missing.join("\n")}`);
  }
}

async function writeBuildManifest() {
  const files = await listFiles(dist);
  const manifest = [];
  for (const file of files) {
    const info = await stat(file);
    manifest.push({
      path: path.relative(dist, file).replaceAll("\\", "/"),
      bytes: info.size,
    });
  }
  await writeFile(
    path.join(dist, "build-manifest.json"),
    JSON.stringify({ files: manifest }, null, 2),
    "utf8",
  );
}

await copyStaticFiles();
await validateHtmlReferences();
await writeBuildManifest();

console.log("Built static site to dist/ and validated local references.");
