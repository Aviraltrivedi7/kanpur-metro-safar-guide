/**
 * PWA icon generator — npx tsx scripts/generate-icons.ts
 *
 * Renders app/icon.svg (the dark-tile favicon mark) to the PNG sizes the
 * manifest references. Maskable variants redraw the mark at 62.5% inside a
 * full-bleed dark tile so Android's circular safe zone never crops it.
 */
import sharp from 'sharp';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const SVG_PATH = path.join(ROOT, 'app', 'icon.svg');
const OUT_DIR = path.join(ROOT, 'public', 'icons');

const TARGETS: Array<{ file: string; size: number; maskable: boolean }> = [
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-192-maskable.png', size: 192, maskable: true },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-512-maskable.png', size: 512, maskable: true },
];

async function main(): Promise<void> {
  const svg = fs.readFileSync(SVG_PATH).toString();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Maskable: full-bleed dark tile + the mark scaled to 62.5% and centered
  // inside the 80% safe zone (16x16..32x32 of the 48 viewBox).
  const inner = svg
    .replace(/<\/?svg[^>]*>/g, '')
    .replace('<rect width="48" height="48" rx="10" fill="#0F172A"/>', '');
  const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#0F172A"/><g transform="translate(9,9) scale(0.625)">${inner}</g></svg>`;

  for (const { file, size, maskable } of TARGETS) {
    // density = rasterized px per viewBox unit: 48-unit viewBox at
    // (size/48)*72 dpi renders exactly `size` px, then resize is a no-op.
    const density = Math.round((size / 48) * 72);
    const input = Buffer.from(maskable ? maskableSvg : svg);
    await sharp(input, { density }).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(OUT_DIR, file));
    console.log(`wrote ${file} (${size}x${size}${maskable ? ', maskable' : ''})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
