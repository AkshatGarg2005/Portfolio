import { PALETTE, TIMING } from './config.js'
import { bezier, clamp, easeMove, rand } from './math.js'

const SVG_NS = 'http://www.w3.org/2000/svg'

const ARROW_SVG =
  '<svg class="sw-arrow" width="22" height="24" viewBox="0 0 22 24" aria-hidden="true">' +
  '<path d="M3 2.5 L3 19.5 L7.6 15.4 L10.9 22.2 L14 20.8 L10.8 14.2 L17 14.2 Z" ' +
  'fill="var(--c)" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>'

const CROSS_SVG =
  '<svg class="sw-cross" width="26" height="26" viewBox="-13 -13 26 26" aria-hidden="true">' +
  '<g stroke="#0B1020" stroke-width="3.5" stroke-linecap="round">' +
  '<path d="M-10 0H-3.5M3.5 0H10M0 -10V-3.5M0 3.5V10"/></g>' +
  '<g stroke="var(--c)" stroke-width="1.6" stroke-linecap="round">' +
  '<path d="M-10 0H-3.5M3.5 0H10M0 -10V-3.5M0 3.5V10"/></g>' +
  '<circle r="1.4" fill="var(--c)"/></svg>'

// Writes position and size only when they change, so idle chrome costs nothing.
function place(el, x, y, w, h) {
  const p = el._p || (el._p = { x: Infinity, y: Infinity, w: Infinity, h: Infinity })
  if (Math.abs(p.x - x) > 0.05 || Math.abs(p.y - y) > 0.05) {
    el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`
    p.x = x
    p.y = y
  }
  if (w !== undefined && Math.abs(p.w - w) > 0.05) {
    el.style.width = `${w.toFixed(1)}px`
    p.w = w
  }
  if (h !== undefined && Math.abs(p.h - h) > 0.05) {
    el.style.height = `${h.toFixed(1)}px`
    p.h = h
  }
}

function show(el, on) {
  if (el._on === on) return
  el._on = on
  el.classList.toggle('off', !on)
}

// Selection outline, draw rectangle, size badge, caret, clone ghost and pen
// path belonging to one agent. Created on first use and reused.
class Decor {
  constructor(agent) {
    this.agent = agent
    this.layer = agent.engine.layers.decor
    this.els = {}
    this.selItem = null
  }

  el(name, make) {
    let el = this.els[name]
    if (!el) {
      el = make()
      el.classList.add('sw-d', 'off')
      el._on = false
      el.style.setProperty('--c', this.agent.hex)
      el.style.setProperty('--ct', this.agent.ink)
      el.style.setProperty('--cl', this.agent.label)
      this.layer.appendChild(el)
      this.els[name] = el
    }
    return el
  }

  div(cls, html = '') {
    const d = document.createElement('div')
    d.className = cls
    if (html) d.innerHTML = html
    return d
  }

  select(item) {
    const el = this.el('sel', () => this.div('sw-sel', '<i></i><i></i><i></i><i></i><span class="sw-tag"></span>'))
    el.lastChild.textContent = item.label
    this.selItem = item
    this.update()
    show(el, true)
  }

  unselect() {
    this.selItem = null
    if (this.els.sel) show(this.els.sel, false)
  }

  draw(x, y, w, h) {
    const el = this.el('draw', () => this.div('sw-draw'))
    place(el, x, y, w, h)
    show(el, true)
  }

  size(cx, y, w, h) {
    const el = this.el('size', () => this.div('sw-size'))
    const text = `${Math.round(w)} × ${Math.round(h)}`
    if (el._t !== text) {
      el.textContent = text
      el._t = text
    }
    place(el, cx, y)
    show(el, true)
  }

  caret(x, y, h, blink) {
    const el = this.el('caret', () => this.div('sw-caret'))
    place(el, x, y, undefined, h)
    if (el._blink !== blink) {
      el._blink = blink
      el.classList.toggle('blink', blink)
    }
    show(el, true)
  }

  ghost(item, x, y, w, h) {
    const el = this.el('ghost', () => this.div('sw-ghost'))
    if (el._for !== item) {
      el._for = item
      const s = item.style
      el.style.background = s.bg
      el.style.borderRadius = `${s.radius}px`
      const bw = Math.max(...s.borderWidths)
      el.style.border = bw ? `${bw}px solid ${s.borderColor}` : 'none'
      el.textContent = ''
      const g = item.ghostText
      if (g && g.text) {
        const t = document.createElement('span')
        t.className = 'sw-ghost-text'
        t.textContent = g.text
        Object.assign(t.style, {
          left: `${g.x}px`,
          top: `${g.y}px`,
          lineHeight: `${g.h}px`,
          font: g.font,
          letterSpacing: g.letterSpacing,
          color: g.color,
        })
        el.appendChild(t)
      }
    }
    place(el, x, y, w, h)
    show(el, true)
  }

  pen(x, y, w, h, d, len) {
    const el = this.el('pen', () => {
      const svg = document.createElementNS(SVG_NS, 'svg')
      svg.setAttribute('class', 'sw-pen')
      svg.setAttribute('aria-hidden', 'true')
      const path = document.createElementNS(SVG_NS, 'path')
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-width', '1.75')
      path.setAttribute('stroke-linecap', 'round')
      svg.appendChild(path)
      return svg
    })
    const path = el.firstChild
    path.setAttribute('d', d)
    path.setAttribute('stroke-dasharray', `${len} ${len}`)
    path.setAttribute('stroke-dashoffset', `${len}`)
    el.setAttribute('width', Math.max(1, Math.ceil(w)))
    el.setAttribute('height', Math.max(1, Math.ceil(h)))
    el._len = len
    place(el, x, y)
    show(el, true)
  }

  penProgress(dist, x, y) {
    const el = this.els.pen
    if (!el) return
    el.firstChild.setAttribute('stroke-dashoffset', `${Math.max(0, el._len - dist).toFixed(2)}`)
    place(el, x, y)
  }

  hide(name) {
    const el = this.els[name]
    if (el) show(el, false)
  }

  clear() {
    this.selItem = null
    for (const el of Object.values(this.els)) show(el, false)
  }

  // Keeps the selection outline glued to its element (it can move while it
  // springs onto a guide, or after a re-measure).
  update() {
    const item = this.selItem
    if (!item) return
    const r = this.agent.engine.rectOf(item)
    place(this.els.sel, r.x, r.y, r.w, r.h)
  }

  destroy() {
    for (const el of Object.values(this.els)) el.remove()
    this.els = {}
  }
}

let nextId = 1

export class Agent {
  constructor(engine, { name, color, role, extra = false, x, y }) {
    this.engine = engine
    this.id = nextId++
    this.name = name
    this.colorName = color
    this.hex = PALETTE[color].hex
    this.ink = PALETTE[color].ink
    this.label = PALETTE[color].label
    this.role = role
    this.extra = extra
    this.x = x
    this.y = y
    this.sepX = 0
    this.sepY = 0
    this.driftAmp = 1
    this.phase = [rand(0, 6.28), rand(0, 6.28), rand(0, 6.28), rand(0, 6.28)]
    this.task = null
    this.item = null
    this.idleSince = performance.now()
    this.leaving = false
    this.flockK = rand(2.4, 4.6)
    this.flockSlot = 0

    const el = document.createElement('div')
    el.className = 'sw-agent'
    el.style.setProperty('--c', this.hex)
    el.style.setProperty('--ct', this.ink)
    el.style.setProperty('--cl', this.label)
    el.innerHTML =
      `<div class="sw-agent-in">${ARROW_SVG}${CROSS_SVG}` +
      `<span class="sw-pill"></span><span class="sw-alt">⌥</span></div>`
    el.querySelector('.sw-pill').textContent = name
    this.el = el
    engine.layers.cursors.appendChild(el)
    this.decor = new Decor(this)
    this.render(performance.now())
  }

  get busy() {
    return this.task !== null
  }

  appear(delay = 0) {
    setTimeout(() => this.el.classList.add('is-in'), delay)
  }

  setTool(tool) {
    this.el.classList.toggle('is-cross', tool === 'cross')
  }

  setAlt(on) {
    this.el.classList.toggle('is-alt', on)
  }

  assign(gen, item) {
    this.task = gen
    this.item = item
  }

  abort() {
    if (this.task) {
      const t = this.task
      this.task = null
      this.item = null
      try {
        t.return()
      } catch {
        /* cleanup errors are not fatal */
      }
    }
    this.decor.clear()
    this.setTool('arrow')
    this.setAlt(false)
    this.idleSince = performance.now()
  }

  // Generator: travels to `target` ({x, y} or a function returning one) along
  // a cubic bezier bent by a random control offset. Duration depends on
  // distance; the target is re-read every frame so it survives re-measures.
  *moveTo(target, { onFrame, speed = 1 } = {}) {
    const get = typeof target === 'function' ? target : () => target
    const p0 = { x: this.x, y: this.y }
    let p3 = get()
    const dist = Math.hypot(p3.x - p0.x, p3.y - p0.y)
    if (dist < 1.5) {
      this.x = p3.x
      this.y = p3.y
      return
    }
    const dur = clamp(TIMING.moveBase + dist * TIMING.movePerPx, TIMING.moveBase, TIMING.moveMax) / speed
    const bend = clamp(dist * rand(0.12, 0.32), 10, 150) * (Math.random() < 0.5 ? -1 : 1)
    const skew = rand(0.25, 0.45)
    const c1 = { x: 0, y: 0 }
    const c2 = { x: 0, y: 0 }
    const out = { x: 0, y: 0 }
    let t = 0
    while (t < dur) {
      const dt = yield
      t = Math.min(dur, t + dt)
      p3 = get()
      const dx = p3.x - p0.x
      const dy = p3.y - p0.y
      const len = Math.hypot(dx, dy) || 1
      const nx = -dy / len
      const ny = dx / len
      c1.x = p0.x + dx * skew + nx * bend
      c1.y = p0.y + dy * skew + ny * bend
      c2.x = p0.x + dx * (skew + 0.4) + nx * bend * 0.55
      c2.y = p0.y + dy * (skew + 0.4) + ny * bend * 0.55
      const s = easeMove(t / dur)
      bezier(p0, c1, c2, p3, s, out)
      this.x = out.x
      this.y = out.y
      if (onFrame) onFrame(t / dur, s)
    }
    this.x = p3.x
    this.y = p3.y
  }

  // Advances the current task by `dt` engine-milliseconds.
  step(dt, now) {
    if (!this.task) return
    let res
    try {
      res = this.task.next(dt)
    } catch (err) {
      this.task = null
      this.engine.taskFailed(this, err)
      return
    }
    if (res.done) {
      this.task = null
      this.item = null
      this.idleSince = now
    }
  }

  render(now) {
    const target = this.task ? 0 : 1
    this.driftAmp += (target - this.driftAmp) * 0.08
    const [a, b, c, d] = this.phase
    const dx = (Math.sin(now / 950 + a) * 2.6 + Math.sin(now / 410 + b) * 1.1) * this.driftAmp
    const dy = (Math.cos(now / 1100 + c) * 2.6 + Math.sin(now / 530 + d) * 1.1) * this.driftAmp
    place(this.el, this.x + this.sepX + dx, this.y + this.sepY + dy)
    this.decor.update()
  }

  leave(toX, toY) {
    this.leaving = true
    this.task = null
    this.decor.clear()
    const self = this
    this.task = (function* () {
      yield* self.moveTo({ x: toX, y: toY }, { speed: 1.4 })
    })()
    this.el.classList.add('is-leaving')
  }

  destroy() {
    this.decor.destroy()
    this.el.remove()
  }
}
