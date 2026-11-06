// Genera los PNG de la app a partir de public/icons/icon.svg
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const svg = readFileSync('public/icons/icon.svg');
const out = (n, size, pad = 0) =>
  sharp(svg, { density: 384 }).resize(size - pad * 2, size - pad * 2)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: '#c9a0f5' })
    .png().toFile(`public/icons/${n}.png`);
await out('icon-192', 192);
await out('icon-512', 512);
await out('maskable-512', 512, 64);
await out('apple-touch-icon', 180);
console.log('icons ok');
