export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
export const lerp = (a, b, t) => a + (b - a) * t
export const rand = (lo, hi) => lo + Math.random() * (hi - lo)

export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
export const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2

// Ease-in-out that runs a few percent past the target near the end and
// settles back on it, so a cursor lands with a slight overshoot.
export function easeMove(t, overshoot = 0.045) {
  const base = easeInOutCubic(t)
  if (t <= 0.7) return base
  const s = Math.sin(Math.PI * ((t - 0.7) / 0.3))
  return base + overshoot * s * s
}

// Point on a cubic bezier. Works for s > 1 too (extrapolates along the curve),
// which is how the overshoot carries on in the direction of travel.
export function bezier(p0, c1, c2, p3, s, out) {
  const m = 1 - s
  const a = m * m * m
  const b = 3 * m * m * s
  const c = 3 * m * s * s
  const d = s * s * s
  out.x = a * p0.x + b * c1.x + c * c2.x + d * p3.x
  out.y = a * p0.y + b * c1.y + c * c2.y + d * p3.y
  return out
}

// Builds a path along an element's border so a pen can trace it.
// Returns the SVG path data, its length and a function that maps a distance
// along the path to a point. Coordinates are local to the element box.
export function borderPath(w, h, style) {
  const [bt, br, bb, bl] = style.borderWidths
  const all = bt > 0 && br > 0 && bb > 0 && bl > 0
  const segs = []
  if (all || (!bt && !br && !bb && !bl)) {
    const inset = Math.max(bt, 1) / 2
    const x0 = inset
    const y0 = inset
    const W = Math.max(0, w - inset * 2)
    const H = Math.max(0, h - inset * 2)
    const r = clamp(style.radius - inset, 0, Math.min(W, H) / 2)
    const line = (x1, y1, x2, y2) => segs.push({ line: true, x1, y1, x2, y2, len: Math.hypot(x2 - x1, y2 - y1) })
    const arc = (cx, cy, a0) => r > 0 && segs.push({ line: false, cx, cy, a0, r, len: (Math.PI / 2) * r })
    line(x0 + r, y0, x0 + W - r, y0)
    arc(x0 + W - r, y0 + r, -Math.PI / 2)
    line(x0 + W, y0 + r, x0 + W, y0 + H - r)
    arc(x0 + W - r, y0 + H - r, 0)
    line(x0 + W - r, y0 + H, x0 + r, y0 + H)
    arc(x0 + r, y0 + H - r, Math.PI / 2)
    line(x0, y0 + H - r, x0, y0 + r)
    arc(x0 + r, y0 + r, Math.PI)
  } else {
    // Only some sides have a border (e.g. a header with a bottom rule).
    if (bt) segs.push({ line: true, x1: 0, y1: bt / 2, x2: w, y2: bt / 2, len: w })
    if (br) segs.push({ line: true, x1: w - br / 2, y1: 0, x2: w - br / 2, y2: h, len: h })
    if (bb) segs.push({ line: true, x1: 0, y1: h - bb / 2, x2: w, y2: h - bb / 2, len: w })
    if (bl) segs.push({ line: true, x1: bl / 2, y1: h, x2: bl / 2, y2: 0, len: h })
  }

  let d = ''
  let len = 0
  let px = null
  let py = null
  for (const s of segs) {
    if (s.line) {
      if (px === null || Math.abs(px - s.x1) > 0.01 || Math.abs(py - s.y1) > 0.01) d += `M${s.x1.toFixed(2)} ${s.y1.toFixed(2)}`
      d += `L${s.x2.toFixed(2)} ${s.y2.toFixed(2)}`
      px = s.x2
      py = s.y2
    } else {
      const ex = s.cx + Math.cos(s.a0 + Math.PI / 2) * s.r
      const ey = s.cy + Math.sin(s.a0 + Math.PI / 2) * s.r
      d += `A${s.r.toFixed(2)} ${s.r.toFixed(2)} 0 0 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`
      px = ex
      py = ey
    }
    len += s.len
  }

  const at = (dist, out = { x: 0, y: 0 }) => {
    let rem = clamp(dist, 0, len)
    for (const s of segs) {
      if (rem <= s.len || s === segs[segs.length - 1]) {
        const t = s.len ? clamp(rem / s.len, 0, 1) : 0
        if (s.line) {
          out.x = lerp(s.x1, s.x2, t)
          out.y = lerp(s.y1, s.y2, t)
        } else {
          const a = s.a0 + (Math.PI / 2) * t
          out.x = s.cx + Math.cos(a) * s.r
          out.y = s.cy + Math.sin(a) * s.r
        }
        return out
      }
      rem -= s.len
    }
    return out
  }

  return { d, len: Math.max(len, 1), at }
}

// Damped spring, integrated in small fixed steps so large frame gaps or the
// 3× speed setting stay stable. Mutates and returns `s` ({ x, v }).
export function springTo(s, target, dtMs, k = 420, c = 22) {
  let t = dtMs / 1000
  while (t > 0) {
    const h = Math.min(t, 1 / 240)
    const a = -k * (s.x - target) - c * s.v
    s.v += a * h
    s.x += s.v * h
    t -= h
  }
  return s
}
