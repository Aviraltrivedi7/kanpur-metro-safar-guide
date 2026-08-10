// One-off script: generates PWA icon PNGs (pure Node, no dependencies).
// Logo concept: two vertical metro rails joined by a slanted centre span forming
// an "M", with an amber tie-bar below — reads as both "metro" and "KANPUR METRO".
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const METRO_BLUE = [29, 78, 216];
const WHITE = [255, 255, 255];
const AMBER = [245, 158, 11];
const NAVY = [15, 23, 42];
const NAVY_2 = [17, 26, 46];
const LIGHT = [226, 232, 240];

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePNG(size, pixelFn) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  let o = 0;
  for (let y = 0; y < size; y++) {
    raw[o++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelFn(x, y);
      raw[o++] = r;
      raw[o++] = g;
      raw[o++] = b;
      raw[o++] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- geometry helpers -------------------------------------------------------
const distToSeg = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
};

const distToBox = (px, py, cx, cy, w, h) => {
  const dx = Math.max(Math.abs(px - cx) - w / 2, 0);
  const dy = Math.max(Math.abs(py - cy) - h / 2, 0);
  return Math.hypot(dx, dy); // 0 inside
};

/**
 * Logo painter. safeInset = fraction of padding per side (maskable needs ~0.2).
 * Logomark = M + rail-button.
 */
function makePainter(size, { maskable }) {
  const inset = maskable ? Math.round(size * 0.2) : Math.round(size * 0.12);
  const min = inset;
  const max = size - inset;
  const m = max - min; // mark box side

  const stroke = Math.max(2, Math.round(m * 0.16));
  const half = stroke / 2;

  const mTop = min;
  const mHeight = m * 0.62;
  const mBottom = mTop + mHeight;
  const notchPeak = mTop + m * 0.30;
  const tieY = mBottom + stroke * 1.15;
  const tieH = stroke * 0.55;
  const tieW = m * 0.50;

  // M: left bar, right bar, two diagonals meeting at notch
  const segs = [
    [min, mTop, min, mBottom],
    [max, mTop, max, mBottom],
    [min, mTop, min + m / 2, notchPeak],
    [max, mTop, min + m / 2, notchPeak],
  ];

  return (x, y) => {
    const px = x + 0.5;
    const py = y + 0.5;

    // bg
    let color = maskable ? METRO_BLUE.slice() : NAVY.slice();
    if (!maskable) color = NAVY.slice();

    // inner glow ring on standard icon (keeps depth)
    if (!maskable && distToBox(px, py, size / 2, size / 2, m * 0.78, m * 0.78) <= stroke * 0.35) {
      color = NAVY_2.slice();
    }

    // amber tie
    if (distToBox(px, py, (min + max) / 2, tieY, tieW, tieH) <= 0) color = AMBER.slice();

    // M strokes — white for contrast, light grey on maskable
    for (const [x1, y1, x2, y2] of segs) {
      if (distToSeg(px, py, x1, y1, x2, y2) <= half) {
        color = WHITE.slice();
        break;
      }
    }

    return [...color, 255];
  };
}

mkdirSync(join('public', 'icons'), { recursive: true });

const targets = [
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-512-maskable.png', size: 512, maskable: true },
];

for (const t of targets) {
  const png = encodePNG(t.size, makePainter(t.size, { maskable: t.maskable }));
  writeFileSync(join('public', 'icons', t.file), png);
  console.log(`wrote public/icons/${t.file} (${t.size}x${t.size}, ${png.length} bytes)`);
}
