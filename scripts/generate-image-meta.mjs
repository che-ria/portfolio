/**
 * Reads the intrinsic pixel size of every portfolio image straight from the CDN
 * and writes `data/image-meta.json`.
 *
 * Why this exists: the galleries render remote images, so Next cannot infer an
 * aspect ratio at build time the way it does for a static import. Without one,
 * every tile reserved a square box and then snapped to the real shape once the
 * bytes arrived — the layout shift that made the pages feel broken while
 * loading. It also meant the masonry layout could only learn which images are
 * wide *after* downloading them, forcing a second reflow.
 *
 * Only the file header is downloaded (a ranged GET of the first 64 KB), so the
 * whole catalogue costs a few megabytes rather than the ~644 MiB it weighs.
 *
 * Run it after adding or replacing artwork:
 *
 *   npm run media:meta
 */
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// The `data/` modules import each other extensionlessly, which TypeScript
// resolves but Node's ESM loader does not. Node strips the types on its own
// (v22.18+); it only needs help finding the file.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)) {
      const candidate = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(candidate)) return next(candidate.href, context);
    }
    return next(specifier, context);
  },
});

const HEADER_BYTES = 65_536;
const CONCURRENCY = 16;
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const metaFile = join(root, "data", "image-meta.ts");

// This script reads the image list out of `data/site.ts`, which imports the very
// table the script writes. Stub it when it is missing so a fresh checkout — or a
// checkout where the table was deleted to force a clean rebuild — can bootstrap
// itself. The sizes are not used here, only the `src` values.
if (!existsSync(metaFile)) await writeFile(metaFile, "export const imageMeta: Record<string, [width: number, height: number]> = {};\n");

const { artworks, marketingArtworks, projectImages, projects } = await import("../data/site.ts");
const { mediaUrl } = await import("../data/media.ts");

/** PNG stores width/height as two big-endian uint32 right after the IHDR tag. */
function readPng(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/**
 * JPEG keeps the dimensions in a start-of-frame marker, which sits after an
 * arbitrary number of metadata segments (EXIF thumbnails alone can run to tens
 * of kilobytes), so the segment chain has to be walked rather than indexed.
 */
function readJpeg(buffer) {
  if (buffer.readUInt16BE(0) !== 0xffd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    // SOF0–SOF15 carry the frame header; C4/C8/CC are Huffman/arithmetic tables
    // that share the numeric range and must be skipped.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 2; continue; }
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  return null;
}

function readWebp(buffer) {
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X") return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1 };
  if (chunk === "VP8 ") return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  if (chunk === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

/**
 * AVIF is ISOBMFF. Rather than walking the full box tree down to
 * meta→iprp→ipco→ispe, scan for the `ispe` tag: these files hold a single image
 * item, so the first one found is the primary image's size.
 */
function readAvif(buffer) {
  if (buffer.toString("ascii", 4, 8) !== "ftyp") return null;
  const index = buffer.indexOf("ispe", 0, "ascii");
  if (index === -1) return null;
  return { width: buffer.readUInt32BE(index + 8), height: buffer.readUInt32BE(index + 12) };
}

function readDimensions(buffer) {
  if (buffer.length < 32) return null;
  return readPng(buffer) ?? readJpeg(buffer) ?? readWebp(buffer) ?? readAvif(buffer);
}

async function probe(url) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { Range: `bytes=0-${HEADER_BYTES - 1}` } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const size = readDimensions(Buffer.from(await response.arrayBuffer()));
      if (!size || !size.width || !size.height) throw new Error("unrecognised header");
      return size;
    } catch (error) {
      if (attempt === 2) return { error: String(error.message ?? error) };
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
}

const urls = [
  ...projects.flatMap((project) => [project.cover, project.logo].filter(Boolean)),
  ...artworks.map((image) => image.src),
  ...marketingArtworks.map((image) => image.src),
  ...Object.values(projectImages).flatMap((images) => images.map((image) => image.src)),
  mediaUrl("/portfolio/profile/icon.png"),
  mediaUrl("/portfolio/profile/contact.jpg"),
];

const unique = [...new Set(urls)];
const meta = {};
const failures = [];
let done = 0;

await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  for (let index = unique.shift(); index !== undefined; index = unique.shift()) {
    const result = await probe(index);
    const key = new URL(index).pathname;
    if (result.error) failures.push(`${key} — ${result.error}`);
    else meta[key] = [result.width, result.height];
    done += 1;
    if (done % 25 === 0) process.stdout.write(`  ${done} probed\n`);
  }
}));

// Emitted as a TypeScript module rather than JSON so that one file reads the
// same way everywhere: Node's ESM loader demands a `with { type: "json" }`
// attribute that TypeScript's bundler resolution does not, and this script has
// to import the same `data/` graph the app does. It also types the entries as
// real tuples, which a JSON import cannot express.
const keys = Object.keys(meta).sort();
const body = keys.map((key) => `  ${JSON.stringify(key)}: [${meta[key].join(", ")}],`).join("\n");
await writeFile(metaFile, `/**
 * Intrinsic pixel size of every portfolio image, keyed by bucket path.
 *
 * Generated by \`npm run media:meta\` — do not edit by hand. See
 * \`scripts/generate-image-meta.mjs\` and the "After adding or replacing
 * artwork" section of ASSETS.md.
 */
export const imageMeta: Record<string, [width: number, height: number]> = {
${body}
};
`);

console.log(`\nWrote data/image-meta.ts — ${keys.length} images.`);
if (failures.length) {
  console.warn(`\n${failures.length} could not be read (they fall back to a 4:3 box):`);
  failures.forEach((line) => console.warn(`  ${line}`));
}
