/**
 * Icon generator — npx tsx scripts/generate-icons.ts
 *
 * Source of truth: public/logo.png (the official emblem image, unmodified).
 * Emits:
 *  - public/icons/logo-256.png / logo-512.png  (UI <img> sources)
 *  - app/icon.png                            (Next.js auto favicon)
 *  - public/icons/icon-192.png / icon-512.png (PWA, plain — emblem as-is)
 *  - public/icons/icon-192-maskable.png / icon-512-maskable.png
 *    (mark at 72% centered on a full-bleed #0F172A tile — Android safe zone)
 */
import sharp from 'sharp';
import * as path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'logo.png');
const ICONS = path.join(ROOT, 'public', 'icons');

async function plain(size: number, file: string): Promise<void> {
  await sharp(SRC).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(ICONS, file));
  console.log(`wrote ${file} (${size}x${size})`);
}

async function maskable(size: number, file: string): Promise<void> {
  const innerSize = Math.round(size * 0.72);
  const offset = Math.round((size - innerSize) / 2);
  const inner = await sharp(SRC).resize(innerSize, innerSize).png().toBuffer();
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 },
    },
  })
    .composite([{ input: inner, left: offset, top: offset }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(ICONS, file));
  console.log(`wrote ${file} (${size}x${size}, maskable)`);
}

async function main(): Promise<void> {
  await sharp(SRC).resize(256, 256).png({ compressionLevel: 9 }).toFile(path.join(ICONS, 'logo-256.png'));
  console.log('wrote logo-256.png (256x256)');
  await sharp(SRC).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(ICONS, 'logo-512.png'));
  console.log('wrote logo-512.png (512x512)');
  await sharp(SRC).resize(64, 64).png({ compressionLevel: 9 }).toFile(path.join(ROOT, 'app', 'icon.png'));
  console.log('wrote app/icon.png (64x64 favicon)');

  await plain(192, 'icon-192.png');
  await plain(512, 'icon-512.png');
  await maskable(192, 'icon-192-maskable.png');
  await maskable(512, 'icon-512-maskable.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
