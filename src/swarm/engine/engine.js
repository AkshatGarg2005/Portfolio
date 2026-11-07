import { Agent } from './agent.js'
import { BASE_AGENTS, COLOR_ORDER, EXTRA_NAMES, KIND_ROLE, ROLES, TIMING } from './config.js'
import { clamp, rand } from './math.js'
import { runStep } from './tasks.js'
import { buildPlan, measureUnits, restoreText, splitText } from './text.js'

export const PLAYED_KEY = 'swarm:played'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function imageReady(img) {
  const decode = () => (img.decode ? img.decode().catch(() => {}) : undefined)
  if (img.complete) return Promise.resolve(decode())
  return new Promise((res) => {
    img.addEventListener('load', res, { once: true })
    img.addEventListener('error', res, { once: true })
  }).then(decode)
}

/**
 * Drives the swarm rebuild. Elements register through <Build>; the engine
 * measures them, hides them, and hands their steps (box, text, border, ...)
 * to agents. One requestAnimationFrame loop moves every agent. Positions are
 * written straight to the DOM; React only hears about coarse state (mode,
 * speed, tour, counts) through a throttled snapshot.
 *
 * Modes: idle → loading → building → done → leaving → live
 */
export class SwarmEngine {
  constructor() {
    this.items = new Map()
    this.list = []
    this.orderDirty = true
    this.agents = []
    this.guides = []
    this.mode = 'idle'
    this.speed = 1
    this.tour = true
    this.boost = 1
    this.boostTarget = 1
    this.view = { top: 0, h: 800, w: 1280 }
    this.rootDoc = { x: 0, y: 0 }
    this.docH = 0
    this.listeners = new Set()
    this.session = 0
    this.raf = 0
    this.last = 0
    this.statsAt = 0
    this.holdUntil = 0
    this.extraSeq = 0
    this.lastSpawn = 0
    this.scrollSpeed = 0
    this.scrollAt = 0
    this.lastUserScroll = -1e9
    this.expectScroll = null
    this.tourY = null
    this.pointer = null
    this.returnAt = null
    this.finishedAt = 0
    this.root = null
    this.overlay = null
    this.layers = null
    this.snapshot = { mode: 'idle', speed: 1, tour: true, built: 0, total: 0, agents: [] }
  }

  // ---------------------------------------------------------------- React glue

  subscribe = (fn) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  getSnapshot = () => this.snapshot

  emit() {
    const { built, total } = this.counts()
    const agents = []
    for (const a of this.agents) if (!a.leaving) agents.push(a.colorName)
    const s = this.snapshot
    if (
      s.mode === this.mode &&
      s.speed === this.speed &&
      s.tour === this.tour &&
      s.built === built &&
      s.total === total &&
      s.agents.join() === agents.join()
    ) {
      return
    }
    this.snapshot = { mode: this.mode, speed: this.speed, tour: this.tour, built, total, agents }
    for (const fn of this.listeners) fn()
  }

  setMode(mode) {
    this.mode = mode
    this.emit()
  }

  // ------------------------------------------------------------- registration

  register(id, el, opts) {
    let item = this.items.get(id)
    if (!item) {
      item = {
        id,
        el,
        opts,
        steps: opts.steps.slice(),
        stepIndex: opts.steps.length,
        busy: false,
        state: 'done',
        skipped: false,
        rect: { x: 0, y: 0, w: 0, h: 0 },
        offset: { x: 0, y: 0 },
        style: { display: 'block', radius: 0, bg: 'transparent', borderColor: 'transparent', borderWidths: [0, 0, 0, 0] },
        text: null,
        locked: false,
        groupSource: null,
        img: null,
        label: '',
      }
      this.items.set(id, item)
    }
    item.el = el
    item.opts = opts
    item.label = opts.label || el.tagName.toLowerCase()
    // The picture an image step wipes in: an <img> or an inline <svg>.
    item.img = opts.steps.includes('image') ? (el.matches('img, svg') ? el : el.querySelector('img, svg')) : null
    el.__swItem = item
    this.orderDirty = true
    // Anything that mounts mid-build simply appears finished.
    if (this.mode === 'building' || this.mode === 'done') this.completeInstant(item)
  }

  unregister(id) {
    const item = this.items.get(id)
    if (!item) return
    if (item.busy) this.agentFor(item)?.abort()
    restoreText(item.text)
    if (item.el.__swItem === item) delete item.el.__swItem
    this.items.delete(id)
    this.orderDirty = true
  }

  sorted() {
    if (this.orderDirty) {
      this.list = [...this.items.values()].sort((a, b) => {
        if (a.el === b.el) return 0
        return a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      })
      this.orderDirty = false
    }
    return this.list
  }

  // -------------------------------------------------------------- attachment

  attach(root, overlay) {
    this.root = root
    this.overlay = overlay
    this.layers = {
      guides: overlay.querySelector('.sw-guides'),
      decor: overlay.querySelector('.sw-decor'),
      cursors: overlay.querySelector('.sw-cursors'),
    }
    window.__swarmBooted = true
    this.view.top = window.scrollY
    this.view.h = window.innerHeight
    this.view.w = document.documentElement.clientWidth
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize, { passive: true })
    window.addEventListener('pointermove', this.onPointer, { passive: true })
    document.addEventListener('focusin', this.onFocus)
    this.ro = new ResizeObserver(() => {
      if (this.mode === 'building' || this.mode === 'done') this.measure()
    })
    this.ro.observe(root)
    if (document.fonts) document.fonts.addEventListener('loadingdone', this.onFonts)
  }

  detach() {
    this.session++
    this.stopLoop()
    clearTimeout(this.leaveTimer)
    for (const a of this.agents) a.abort()
    this.clearAgents()
    this.clearGuides()
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('pointermove', this.onPointer)
    document.removeEventListener('focusin', this.onFocus)
    if (document.fonts) document.fonts.removeEventListener('loadingdone', this.onFonts)
    this.ro?.disconnect()
    this.mode = 'idle'
    this.root = null
    this.overlay = null
  }

  onScroll = () => {
    const y = window.scrollY - this.rootDoc.y
    const now = performance.now()
    const dy = Math.abs(y - this.view.top)
    const dt = Math.max(16, now - this.scrollAt)
    this.scrollAt = now
    this.view.top = y
    if (this.expectScroll !== null && Math.abs(window.scrollY - this.expectScroll) < 3) return
    // The visitor scrolled: follow them, and stop touring.
    this.scrollSpeed = Math.max(this.scrollSpeed * 0.7, (dy / dt) * 1000)
    this.lastUserScroll = now
    this.expectScroll = null
    this.tourY = null
    if (this.tour && (this.mode === 'building' || this.mode === 'loading')) {
      this.tour = false
      this.emit()
    }
  }

  onResize = () => {
    this.view.h = window.innerHeight
    this.view.w = document.documentElement.clientWidth
  }

  onPointer = (e) => {
    this.pointer = { x: e.clientX, y: e.clientY }
  }

  onFonts = () => {
    if (this.mode === 'building' || this.mode === 'done') this.measure()
  }

  // Keyboard users tabbing into a part of the page that isn't built yet get
  // that part immediately.
  onFocus = (e) => {
    if (this.mode !== 'building' && this.mode !== 'loading') return
    let el = e.target
    while (el && el !== this.root) {
      const item = el.__swItem
      if (item && item.state !== 'done') this.completeInstant(item)
      el = el.parentElement
    }
  }

  // ---------------------------------------------------------------- measuring

  // The only place that reads layout. Runs at start, on resize and when the
  // root changes size. Temporary transforms and size locks are lifted first
  // so the reads reflect the finished page.
  measure() {
    if (!this.root) return
    const list = this.sorted()
    const relock = []
    for (const it of list) {
      if (it.offset.x || it.offset.y) it.el.style.transform = ''
      if (it.locked) {
        this.unlock(it)
        relock.push(it)
      }
    }

    const rr = this.root.getBoundingClientRect()
    this.rootDoc = { x: rr.left + window.scrollX, y: rr.top + window.scrollY }
    this.docH = rr.height
    this.view.w = document.documentElement.clientWidth
    this.view.h = window.innerHeight
    this.view.top = window.scrollY - this.rootDoc.y
    const active = this.mode === 'building' || this.mode === 'done'
    const appeared = []
    const vanished = []

    for (const it of list) {
      const b = it.el.getBoundingClientRect()
      it.rect = { x: b.left - rr.left, y: b.top - rr.top, w: b.width, h: b.height }
      const cs = getComputedStyle(it.el)
      const wasSkipped = it.skipped
      it.skipped = cs.display === 'none' || (b.width < 1 && b.height < 1)
      if (active && wasSkipped !== it.skipped) (it.skipped ? vanished : appeared).push(it)
      const st = it.style
      st.display = cs.display
      // Layout size, unaffected by rotate/scale, for size locks while typing.
      st.w = parseFloat(cs.width) || b.width
      st.h = parseFloat(cs.height) || b.height
      st.radius = parseFloat(cs.borderTopLeftRadius) || 0
      st.bg = cs.backgroundColor
      st.borderWidths = [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].map(
        (v) => parseFloat(v) || 0,
      )
      if (it.el.getAttribute('data-sw-border') !== 'pending') {
        const side = st.borderWidths.findIndex((w) => w > 0)
        const colors = [cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor]
        st.borderColor = side >= 0 ? colors[side] : 'transparent'
      }
      if (it.opts.steps.includes('text') && (it.state !== 'done' || this.mode === 'loading')) {
        if (!it.text || (!it.text.split && it.text.nodes.some((n) => !n.isConnected))) it.text = buildPlan(it.el, it.opts.typing)
        measureUnits(it.text, rr)
        const first = it.text.nodes[0]
        if (it.opts.group && first && first.parentElement && it.text.units.length) {
          const fs = getComputedStyle(first.parentElement)
          const b = it.text.boxes[0]
          it.ghostText = {
            text: first.nodeValue.trim(),
            x: b.x0 - it.rect.x,
            y: b.y - it.rect.y,
            h: b.h,
            font: `${fs.fontStyle} ${fs.fontWeight} ${fs.fontSize} ${fs.fontFamily}`,
            letterSpacing: fs.letterSpacing,
            color: fs.color,
          }
        }
      }
    }

    for (const it of list) {
      if (it.offset.x || it.offset.y) it.el.style.transform = `translate(${it.offset.x}px,${it.offset.y}px)`
    }
    for (const it of relock) this.lock(it)
    for (const it of appeared) this.completeInstant(it)
    for (const it of vanished) if (it.busy) this.agentFor(it)?.abort()
  }

  rectOf(item) {
    const r = item.rect
    return { x: r.x + item.offset.x, y: r.y + item.offset.y, w: r.w, h: r.h }
  }

  // Clone groups: the first visible member builds with its own steps, the
  // rest are Option-dragged copies that get their text retyped.
  resolveSteps() {
    const groups = new Map()
    for (const it of this.sorted()) {
      const g = it.opts.group
      if (g) {
        if (!groups.has(g)) groups.set(g, [])
        groups.get(g).push(it)
      } else {
        it.steps = it.opts.steps.filter((k) => k !== 'clone')
        it.groupSource = null
      }
    }
    for (const members of groups.values()) {
      const src = members.find((m) => !m.skipped) || members[0]
      for (const it of members) {
        it.groupSource = src
        it.steps =
          it === src
            ? it.opts.steps.filter((k) => k !== 'clone')
            : ['clone', ...it.opts.steps.filter((k) => k === 'text')]
      }
    }
  }

  // ------------------------------------------------------------ item states

  // Pins an element (and the boxes around its text) to its measured size while
  // its text is split into spans, so the split can never move anything.
  lock(it) {
    const fixed = (d) => d !== 'inline' && d !== 'contents' && d !== 'none'
    if (fixed(it.style.display)) {
      it.el.style.width = `${it.style.w}px`
      it.el.style.height = `${it.style.h}px`
    }
    if (it.text) {
      for (const b of it.text.inner) {
        if (!fixed(b.display)) continue
        b.el.style.width = `${b.w}px`
        b.el.style.height = `${b.h}px`
      }
    }
    it.locked = true
  }

  unlock(it) {
    if (!it.locked) return
    it.el.style.width = ''
    it.el.style.height = ''
    if (it.text) {
      for (const b of it.text.inner) {
        b.el.style.width = ''
        b.el.style.height = ''
      }
    }
    it.locked = false
  }

  resetItem(it) {
    restoreText(it.text)
    this.unlock(it)
    const el = it.el
    it.busy = false
    it.offset = { x: 0, y: 0 }
    el.style.transform = ''
    if (it.skipped) {
      this.finishItem(it)
      return
    }
    it.stepIndex = 0
    it.state = 'hidden'
    el.removeAttribute('data-sw')
    if (it.steps.includes('border')) el.setAttribute('data-sw-border', 'pending')
    else el.removeAttribute('data-sw-border')
    if (it.steps.includes('text')) el.setAttribute('data-sw-text', 'pending')
    else el.removeAttribute('data-sw-text')
    if (it.img) it.img.style.clipPath = 'inset(0 0 100% 0)'
  }

  finishItem(it) {
    restoreText(it.text)
    this.unlock(it)
    it.stepIndex = it.steps.length
    it.state = 'done'
    it.offset = { x: 0, y: 0 }
    const el = it.el
    el.style.transform = ''
    el.setAttribute('data-sw', 'done')
    el.removeAttribute('data-sw-border')
    el.removeAttribute('data-sw-text')
    if (it.img) it.img.style.clipPath = ''
  }

  completeInstant(it) {
    if (it.busy) this.agentFor(it)?.abort()
    it.busy = false
    this.finishItem(it)
  }

  agentFor(item) {
    return this.agents.find((a) => a.item === item)
  }

  // Makes an element visible. Text that is still to be typed is split into
  // hidden spans first; an element still waiting for its guide starts a few
  // pixels off so it has somewhere to spring from.
  showItem(it) {
    if (it.state !== 'hidden') return
    const t = it.steps.indexOf('text')
    if (t >= it.stepIndex && it.text) {
      splitText(it.text)
      this.lock(it)
    }
    const g = it.steps.indexOf('guide')
    if (g >= it.stepIndex) {
      // Never start so far left that the element leaves the screen.
      if (it.opts.guide === 'y') this.setOffset(it, 0, 16)
      else this.setOffset(it, -Math.min(22, Math.max(8, it.rect.x - 6)), 0)
    }
    it.state = 'shown'
    it.el.setAttribute('data-sw', 'shown')
  }

  setOffset(it, x, y) {
    it.offset.x = x
    it.offset.y = y
    it.el.style.transform = x || y ? `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)` : ''
  }

  revealBorder(it) {
    it.el.removeAttribute('data-sw-border')
  }

  prepareText(it) {
    if (!it.text) return null
    splitText(it.text)
    this.lock(it)
    return it.text
  }

  finishText(it) {
    restoreText(it.text)
    this.unlock(it)
    it.el.removeAttribute('data-sw-text')
  }

  completeStep(it) {
    it.stepIndex++
    if (it.stepIndex >= it.steps.length) this.finishItem(it)
  }

  groupSource(it) {
    const s = it.groupSource
    return s && s !== it && !s.skipped ? s : null
  }

  depsDone(it) {
    const parent = it.opts.parentId ? this.items.get(it.opts.parentId) : null
    if (parent && !parent.skipped && parent.state !== 'done') return false
    // waitFor: every member of that clone group has to be placed first.
    if (it.opts.waitFor) {
      for (const other of this.items.values()) {
        if (other.opts.group === it.opts.waitFor && !other.skipped && other.state !== 'done') return false
      }
    }
    if (it.steps[it.stepIndex] === 'clone') {
      const s = this.groupSource(it)
      if (s && s.state !== 'done') return false
    }
    return true
  }

  counts() {
    let built = 0
    let total = 0
    for (const it of this.items.values()) {
      if (it.skipped) continue
      total += it.steps.length
      built += Math.min(it.stepIndex, it.steps.length)
    }
    return { built, total }
  }

  // ----------------------------------------------------------------- guides

  addGuide(axis) {
    const line = document.createElement('div')
    line.className = `sw-guide ${axis === 'x' ? 'v' : 'h'}`
    const badge = document.createElement('div')
    badge.className = 'sw-gbadge'
    this.layers.guides.append(line, badge)
    this.guides.push(line, badge)
    let shown = ''
    return {
      set(pos, along) {
        line.style.transform = axis === 'x' ? `translate3d(${pos.toFixed(1)}px,0,0)` : `translate3d(0,${pos.toFixed(1)}px,0)`
        const text = `${axis} ${Math.round(pos)}`
        if (text !== shown) {
          badge.textContent = text
          shown = text
        }
        badge.style.transform =
          axis === 'x'
            ? `translate3d(${(pos + 8).toFixed(1)}px,${(along - 30).toFixed(1)}px,0)`
            : `translate3d(${(along + 16).toFixed(1)}px,${(pos + 8).toFixed(1)}px,0)`
      },
      placed() {
        line.classList.add('placed')
        setTimeout(() => badge.classList.add('off'), 650)
      },
    }
  }

  clearGuides() {
    for (const el of this.guides) el.remove()
    this.guides = []
  }

  // ----------------------------------------------------------------- agents

  spawnBase() {
    const logo = this.sorted().find((it) => it.opts.spawn && !it.skipped)
    const v = this.view
    let cx = 60
    let cy = v.top + 40
    if (logo && logo.rect.y + logo.rect.h > v.top && logo.rect.y < v.top + v.h) {
      cx = logo.rect.x + Math.min(logo.rect.w, 120) * 0.5
      cy = logo.rect.y + logo.rect.h * 0.5
    }
    BASE_AGENTS.forEach((cfg, i) => {
      const a = new Agent(this, { ...cfg, x: cx + rand(-30, 40), y: cy + rand(-10, 26) })
      a.appear(i * 60)
      this.agents.push(a)
    })
    this.holdUntil = performance.now() + 260
  }

  spawnExtra() {
    const v = this.view
    const top = v.top - v.h * 0.25
    const bottom = v.top + v.h
    const demand = Object.fromEntries(ROLES.map((r) => [r, 0]))
    for (const it of this.sorted()) {
      if (it.skipped || it.state === 'done' || it.stepIndex >= it.steps.length) continue
      if (it.rect.y > bottom || it.rect.y + it.rect.h < top) continue
      demand[KIND_ROLE[it.steps[it.stepIndex]]] += 1
    }
    const have = Object.fromEntries(ROLES.map((r) => [r, 0]))
    for (const a of this.agents) if (!a.leaving) have[a.role] += 1
    let role = 'typist'
    let best = -1
    for (const r of ROLES) {
      const score = demand[r] / (have[r] + 1)
      if (score > best) {
        best = score
        role = r
      }
    }
    const seq = this.extraSeq++
    const side = seq % 3
    const x = side === 0 ? -16 : side === 1 ? v.w + 16 : rand(v.w * 0.2, v.w * 0.8)
    const y = side === 2 ? v.top + v.h + 16 : v.top + rand(0.2, 0.85) * v.h
    const lap = Math.floor(seq / EXTRA_NAMES.length)
    const a = new Agent(this, {
      name: EXTRA_NAMES[seq % EXTRA_NAMES.length] + (lap ? lap + 1 : ''),
      color: COLOR_ORDER[seq % COLOR_ORDER.length],
      role,
      extra: true,
      x,
      y,
    })
    a.appear(0)
    this.agents.push(a)
  }

  retire(a) {
    const v = this.view
    const toLeft = a.x < v.w / 2
    a.leave(toLeft ? -40 : v.w + 40, a.y + rand(-40, 40))
  }

  clearAgents() {
    for (const a of this.agents) a.destroy()
    this.agents = []
  }

  // ------------------------------------------------------------- lifecycle

  async start({ replay = false } = {}) {
    if (!this.root || this.mode === 'loading' || this.mode === 'building') return
    const session = ++this.session
    this.returnAt = null
    clearTimeout(this.leaveTimer)
    for (const a of this.agents) a.abort()
    this.clearAgents()
    this.clearGuides()
    this.overlay.classList.remove('is-leaving')
    try {
      sessionStorage.setItem(PLAYED_KEY, '1')
    } catch {
      /* storage can be blocked; the intro then simply plays again next time */
    }
    document.documentElement.setAttribute('data-swarm', 'play')
    if (replay) {
      this.expectScroll = 0
      window.scrollTo(0, 0)
    }
    this.setMode('loading')
    await this.ready()
    if (session !== this.session) return
    this.measure()
    this.resolveSteps()
    for (const it of this.sorted()) this.resetItem(it)
    this.emit()
    if (replay) await sleep(420)
    if (session !== this.session) return
    this.boost = 1
    this.boostTarget = 1
    this.scrollSpeed = 0
    this.tourY = null
    this.spawnBase()
    this.setMode('building')
    this.loop()
  }

  ready() {
    const fonts = document.fonts
      ? Promise.all([
          document.fonts.load('700 64px "Space Grotesk"'),
          document.fonts.load('400 16px Inter'),
          document.fonts.load('500 13px "JetBrains Mono"'),
        ]).then(() => document.fonts.ready)
      : Promise.resolve()
    const images = []
    for (const it of this.items.values()) if (it.img instanceof HTMLImageElement) images.push(imageReady(it.img))
    return Promise.race([Promise.all([fonts, ...images]).catch(() => {}), sleep(4000)])
  }

  completeAll() {
    this.session++
    for (const a of this.agents) {
      if (a.extra) a.leaving = true
      a.abort()
    }
    this.agents = this.agents.filter((a) => {
      if (a.leaving) a.destroy()
      return !a.leaving
    })
    if (this.mode === 'loading') {
      this.measure()
      this.resolveSteps()
    }
    // Every item, including ones never reset, gets marked as built.
    for (const it of this.sorted()) this.completeInstant(it)
  }

  // Skip: jump to the finished page, agents and design chrome still showing.
  skip() {
    if (this.mode !== 'building' && this.mode !== 'loading') return
    const wasLoading = this.mode === 'loading'
    this.completeAll()
    if (wasLoading || !this.agents.length) this.spawnBase()
    this.finish()
    this.loop()
  }

  // Close / Esc: straight to the live site.
  close() {
    if (this.mode === 'live' || this.mode === 'idle') return
    this.goLive()
  }

  goLive() {
    if (this.mode === 'live' || this.mode === 'leaving' || this.mode === 'idle') return
    if (this.mode === 'loading' || this.mode === 'building') this.completeAll()
    this.updateReturn(performance.now(), true)
    this.session++
    this.setMode('leaving')
    this.overlay.classList.add('is-leaving')
    clearTimeout(this.leaveTimer)
    this.leaveTimer = setTimeout(() => {
      this.clearAgents()
      this.clearGuides()
      this.overlay?.classList.remove('is-leaving')
      document.documentElement.setAttribute('data-swarm', 'off')
      this.stopLoop()
      this.setMode('live')
    }, 520)
  }

  replay() {
    if (!this.root) return
    clearTimeout(this.leaveTimer)
    this.session++
    for (const a of this.agents) a.abort()
    this.mode = 'idle'
    this.start({ replay: true })
  }

  setSpeed(n) {
    this.speed = n
    this.emit()
  }

  setTour(on) {
    this.tour = on
    this.tourY = null
    this.emit()
  }

  finish() {
    for (const a of this.agents) if (a.extra && !a.leaving) this.retire(a)
    this.boost = 1
    this.boostTarget = 1
    this.setMode('done')
  }

  taskFailed(agent, err) {
    if (import.meta.env.DEV) console.warn('[swarm] step failed', err)
    const item = agent.item
    agent.item = null
    agent.decor.clear()
    if (item) this.completeInstant(item)
  }

  // -------------------------------------------------------------------- loop

  loop() {
    if (this.raf) return
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  stopLoop() {
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = 0
  }

  tick = (now) => {
    this.raf = requestAnimationFrame(this.tick)
    const dt = clamp(now - this.last, 0, 64)
    this.last = now
    if (this.mode === 'building') this.updateBuild(dt, now)
    else if (this.mode === 'done' || this.mode === 'leaving') {
      this.updateFlock(dt, now)
      this.updateReturn(now)
    }
    this.updateLeavers(dt, now)
    this.separate(dt)
    for (const a of this.agents) a.render(now)
    if (now - this.statsAt > 100) {
      this.statsAt = now
      this.emit()
    }
  }

  updateBuild(dt, now) {
    this.scrollSpeed *= Math.exp(-dt / 450)
    this.buildAbove()
    this.updateTour(dt)
    this.updateExtras(now)
    this.boost += (this.boostTarget - this.boost) * (1 - Math.exp(-dt / 350))
    const edt = dt * this.speed * this.boost
    if (now >= this.holdUntil) this.schedule()
    for (const a of this.agents) if (!a.leaving) a.step(edt, now)
    if (this.isComplete()) {
      this.finish()
      // Let the finished page sit for a beat, then glide back to the top.
      this.finishedAt = now
      this.returnAt = now + 900
    }
  }

  // Takes the visitor back to the top once the build is done, unless they
  // started scrolling on their own in the meantime.
  updateReturn(now, force = false) {
    if (this.returnAt === null || (!force && now < this.returnAt)) return
    this.returnAt = null
    if (this.lastUserScroll > this.finishedAt || window.scrollY < 2) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  updateLeavers(dt, now) {
    let removed = false
    for (const a of this.agents) {
      if (!a.leaving) continue
      a.step(dt, now)
      if (!a.task) {
        a.destroy()
        a.gone = true
        removed = true
      }
    }
    if (removed) this.agents = this.agents.filter((a) => !a.gone)
  }

  // Content more than half a screen above the viewport that never got built
  // is finished instantly, so scrolling back up never shows blank space.
  buildAbove() {
    const limit = this.view.top - this.view.h * 0.5
    // Work in progress gets a little longer before it is finished for the agent.
    const busyLimit = this.view.top - this.view.h
    for (const it of this.sorted()) {
      if (it.skipped || it.state === 'done') continue
      const bottom = it.rect.y + it.rect.h
      if (bottom < (it.busy ? busyLimit : limit)) this.completeInstant(it)
    }
  }

  frontY() {
    let y = Infinity
    for (const it of this.sorted()) {
      if (it.skipped || it.state === 'done') continue
      if (it.rect.y < y) y = it.rect.y
    }
    return y
  }

  // Tour: scroll down at the swarm's pace. It keeps the topmost unfinished
  // element in view, and follows the agents further down the page as long as
  // that element stays on screen.
  updateTour(dt) {
    if (!this.tour) return
    const front = this.frontY()
    if (front === Infinity) return
    const vh = this.view.h
    let busyBottom = -Infinity
    for (const a of this.agents) {
      if (!a.item || a.leaving) continue
      const r = a.item.rect
      busyBottom = Math.max(busyBottom, r.y + Math.min(r.h, vh * 0.4))
    }
    const maxY = Math.max(0, this.docH - vh)
    const follow = Math.min(busyBottom - vh * 0.85, front - vh * 0.06)
    const target = clamp(Math.max(front - vh * 0.32, follow), 0, maxY)
    if (this.tourY === null) this.tourY = this.view.top
    const cur = this.tourY
    if (target <= cur + 0.5) return
    const v = Math.min(TIMING.tourSpeed * this.speed, (target - cur) * 2.2 + 40)
    const next = Math.min(target, cur + (v * dt) / 1000)
    this.tourY = next
    this.view.top = next
    const y = Math.round(next + this.rootDoc.y)
    this.expectScroll = y
    window.scrollTo(0, y)
  }

  // Extra agents: when the visitor scrolls past unbuilt content, more agents
  // fly in from the screen edges (more for faster scrolling) and the whole
  // swarm speeds up. Extras leave once they run out of on-screen work.
  updateExtras(now) {
    const v = this.view
    const top = v.top - v.h * 0.25
    const bottom = v.top + v.h
    let debt = 0
    for (const it of this.sorted()) {
      if (it.skipped || it.state === 'done') continue
      if (it.rect.y > bottom || it.rect.y + it.rect.h < top) continue
      debt += it.steps.length - it.stepIndex
    }
    const cap = v.w < 768 ? 8 : 24
    const recent = now - this.lastUserScroll < 1500
    let extras = 0
    for (const a of this.agents) if (a.extra && !a.leaving) extras++
    // Faster scrolling and more unbuilt work on screen both call in more help.
    const pressure = recent ? this.scrollSpeed / 140 + Math.max(0, debt - 10) / 6 : 0
    const want = clamp(Math.floor(pressure), 0, cap)
    const catchingUp = (extras > 0 && debt > 4) || (recent && debt > 10)
    this.boostTarget = catchingUp ? 1 + clamp(debt / 30, 0, 1.6) : 1
    if (want > extras && now - this.lastSpawn > 70) {
      this.lastSpawn = now
      this.spawnExtra()
    }
    for (const a of this.agents) {
      if (!a.extra || a.leaving || a.task) continue
      if (now - a.idleSince > (catchingUp ? 900 : 300)) this.retire(a)
    }
  }

  // Gives idle agents the topmost available step for their role, within half
  // a screen of the viewport. Extras only take on-screen work.
  schedule() {
    let idle = 0
    for (const a of this.agents) if (!a.task && !a.leaving) idle++
    if (!idle) return
    const v = this.view
    const zoneTop = v.top - v.h * 0.5
    const zoneBottom = v.top + v.h * 1.5
    const cands = { boxer: [], typist: [], pen: [], ruler: [], cloner: [] }
    for (const it of this.sorted()) {
      if (it.skipped || it.busy || it.state === 'done' || it.stepIndex >= it.steps.length) continue
      const r = it.rect
      if (r.y > zoneBottom || r.y + r.h < zoneTop) continue
      if (!this.depsDone(it)) continue
      cands[KIND_ROLE[it.steps[it.stepIndex]]].push(it)
    }
    for (const a of this.agents) {
      if (a.task || a.leaving) continue
      const list = cands[a.role]
      let best = null
      let bestScore = Infinity
      for (const it of list) {
        if (it.busy) continue
        if (a.extra && it.rect.y > v.top + v.h) continue
        const score = it.rect.y + it.rect.x * 0.2 + Math.hypot(it.rect.x - a.x, it.rect.y - a.y) * 0.3
        if (score < bestScore) {
          bestScore = score
          best = it
        }
      }
      if (best) {
        best.busy = true
        a.assign(runStep(this, a, best, best.steps[best.stepIndex]), best)
      }
    }
  }

  isComplete() {
    for (const it of this.items.values()) if (!it.skipped && it.state !== 'done') return false
    for (const a of this.agents) if (a.task && !a.leaving) return false
    return true
  }

  // Done: the agents trail the visitor's pointer in a loose flock, each in its
  // own slot so they never stack.
  updateFlock(dt) {
    const v = this.view
    const anchor = this.pointer
      ? { x: this.pointer.x - this.rootDoc.x + window.scrollX, y: this.pointer.y + v.top }
      : { x: v.w * 0.5, y: v.top + v.h * 0.62 }
    const active = this.agents.filter((a) => !a.leaving)
    const n = active.length
    active.forEach((a, i) => {
      const ang = ((n > 1 ? 18 + (i * 144) / (n - 1) : 70) * Math.PI) / 180
      const rad = 58 + (i % 3) * 26
      const tx = anchor.x + Math.cos(ang) * rad
      const ty = anchor.y + Math.sin(ang) * rad
      const k = 1 - Math.exp((-dt / 1000) * a.flockK)
      a.x += (tx - a.x) * k
      a.y += (ty - a.y) * k
    })
  }

  // Keeps cursors from sitting on top of each other. Working agents give way
  // less than idle ones so they stay on their work.
  separate(dt) {
    const as = this.agents
    const n = as.length
    for (const a of as) {
      a._px = 0
      a._py = 0
    }
    const R = 26
    for (let i = 0; i < n; i++) {
      const a = as[i]
      for (let j = i + 1; j < n; j++) {
        const b = as[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx / 2.2, dy)
        if (d >= R) continue
        let ux = 0.9
        let uy = 0.45
        if (d > 0.01) {
          ux = dx / 2.2 / d
          uy = dy / d
        }
        const push = (R - d) * 0.9
        const wa = a.task ? 0.3 : 1
        const wb = b.task ? 0.3 : 1
        const fa = wa / (wa + wb)
        const fb = wb / (wa + wb)
        a._px -= ux * push * 2.2 * fa
        a._py -= uy * push * fa
        b._px += ux * push * 2.2 * fb
        b._py += uy * push * fb
      }
    }
    const k = 1 - Math.exp(-dt / 140)
    for (const a of as) {
      a.sepX += (a._px - a.sepX) * k
      a.sepY += (a._py - a.sepY) * k
    }
  }
}
