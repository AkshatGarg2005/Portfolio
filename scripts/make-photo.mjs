// Makes the hero picture from a cut-out PNG with a transparent background:
// trims the empty edges and writes four sizes to public/, from
// akshat-480.webp up to akshat-1200.webp.
// Needs the sharp package once:
//   npm i -D sharp && node scripts/make-photo.mjs path/to/picture.png
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const src = process.argv[2]
if (!src) throw new Error('Usage: node scripts/make-photo.mjs <picture.png>')

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H } = info

// Background removers often leave the figure at ~98% opacity, which lets the
// page's dot grid show through. Push near-opaque pixels to fully opaque,
// keeping the soft edge, and find the box around everything visible.
let x0 = W, y0 = H, x1 = -1, y1 = -1
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4 + 3
    data[i] = Math.min(255, Math.round((data[i] * 255) / 240))
    if (data[i] > 8) {
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
}
if (x1 < 0) throw new Error('The picture is fully transparent')

const pad = 4
const left = Math.max(0, x0 - pad)
const top = Math.max(0, y0 - pad)
const box = { left, top, width: Math.min(W, x1 + pad + 1) - left, height: Math.min(H, y1 + pad + 1) - top }

for (const w of [480, 640, 960, 1200]) {
  const out = new URL(`../public/akshat-${w}.webp`, import.meta.url)
  const res = await sharp(data, { raw: info })
    .extract(box)
    .resize({ width: Math.min(w, box.width) })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(fileURLToPath(out))
  console.log(`wrote public/akshat-${w}.webp (${res.width}×${res.height}, ${Math.round(res.size / 1024)} KB)`)
}
