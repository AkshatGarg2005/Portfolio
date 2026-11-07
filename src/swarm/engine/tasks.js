// One generator per kind of step. Each receives the elapsed engine time (ms,
// already scaled by speed) through `yield` once per frame, so every routine
// reads as a script: move here, drag that, wait a beat, finish.

import { borderPath, clamp, easeInOutCubic, easeInOutSine, lerp, rand, springTo } from './math.js'
import { typingDelays } from './text.js'

function* wait(ms, onFrame) {
  let t = 0
  while (t < ms) {
    const dt = yield
    t += dt
    if (onFrame) onFrame(dt)
  }
}

function* tween(ms, fn) {
  let t = 0
  fn(0, 0)
  while (t < ms) {
    const dt = yield
    t = Math.min(ms, t + dt)
    fn(t / ms, dt)
  }
}

export function* runStep(engine, agent, item, kind) {
  try {
    switch (kind) {
      case 'box':
        yield* boxStep(engine, agent, item)
        break
      case 'image':
        yield* imageStep(engine, agent, item)
        break
      case 'text':
        yield* textStep(engine, agent, item)
        break
      case 'border':
        yield* borderStep(engine, agent, item)
        break
      case 'guide':
        yield* guideStep(engine, agent, item)
        break
      case 'clone':
        yield* cloneStep(engine, agent, item)
        break
      default:
        engine.completeStep(item)
    }
  } finally {
    agent.decor.clear()
    agent.setTool('arrow')
    agent.setAlt(false)
    item.busy = false
  }
}

// Boxer: crosshair, drag a dashed rectangle corner to corner with a live size
// badge, then let the element's fill fade in.
function* dragFrame(engine, agent, item) {
  const d = agent.decor
  yield* agent.moveTo(() => {
    const r = engine.rectOf(item)
    return { x: r.x, y: r.y }
  })
  agent.setTool('cross')
  let r = engine.rectOf(item)
  yield* wait(rand(60, 120))
  const dur = clamp(240 + Math.hypot(r.w, r.h) * 0.55, 340, 880)
  yield* tween(dur, (t) => {
    r = engine.rectOf(item)
    const e = easeInOutCubic(t)
    const w = Math.max(1, r.w * e)
    const h = Math.max(1, r.h * e)
    d.draw(r.x, r.y, w, h)
    d.size(r.x + w / 2, r.y + h + 8, w, h)
    agent.x = r.x + w
    agent.y = r.y + h
  })
}

function* boxStep(engine, agent, item) {
  const d = agent.decor
  yield* dragFrame(engine, agent, item)
  engine.showItem(item)
  d.select(item)
  yield* wait(240, () => {
    const r = engine.rectOf(item)
    d.draw(r.x, r.y, r.w, r.h)
  })
  d.hide('draw')
  d.hide('size')
  agent.setTool('arrow')
  yield* wait(140)
  engine.completeStep(item)
}

// Images: the Boxer draws the frame, then the photo wipes in top to bottom.
function* imageStep(engine, agent, item) {
  const d = agent.decor
  yield* dragFrame(engine, agent, item)
  engine.showItem(item)
  d.select(item)
  d.hide('size')
  agent.setTool('arrow')
  const img = item.img
  yield* wait(120)
  d.hide('draw')
  yield* tween(680, (t) => {
    const e = easeInOutSine(t)
    if (img) img.style.clipPath = `inset(0 0 ${((1 - e) * 100).toFixed(2)}% 0)`
    const r = engine.rectOf(item)
    agent.x = r.x + r.w * 0.86
    agent.y = r.y + r.h * e
  })
  if (img) img.style.clipPath = ''
  yield* wait(160)
  engine.completeStep(item)
}

// Typist: walk to the start of the text, show a caret and type it out.
function* textStep(engine, agent, item) {
  const d = agent.decor
  const plan = engine.prepareText(item)
  const n = plan ? plan.units.length : 0
  if (!n) {
    engine.showItem(item)
    engine.finishText(item)
    engine.completeStep(item)
    return
  }
  let typed = -1
  const caret = () => {
    const off = item.offset
    const b = plan.boxes[Math.max(0, typed)]
    const x = typed < 0 ? b.x0 : b.x1
    return { x: x + off.x, y: b.y + off.y, h: b.h }
  }
  const follow = (dt) => {
    const c = caret()
    d.caret(c.x, c.y, c.h, typed < 0 || typed >= n - 1)
    const k = 1 - Math.exp(-dt / 70)
    agent.x += (c.x + 4 - agent.x) * k
    agent.y += (c.y + c.h * 0.92 - agent.y) * k
  }
  yield* agent.moveTo(() => {
    const c = caret()
    return { x: c.x + 4, y: c.y + c.h * 0.92 }
  })
  engine.showItem(item)
  d.select(item)
  yield* wait(rand(20, 40), follow)

  const delays = typingDelays(plan, rand)
  let acc = 0
  let next = 0
  while (next < n) {
    const dt = yield
    acc += dt
    while (next < n && acc >= delays[next]) {
      acc -= delays[next]
      plan.split.spans[next].classList.add('on')
      typed = next
      next++
    }
    follow(dt)
  }
  yield* wait(30, follow)
  engine.finishText(item)
  engine.completeStep(item)
}

// Pen: trace the border as an SVG path, then switch the real border on.
function* borderStep(engine, agent, item) {
  const d = agent.decor
  let r = engine.rectOf(item)
  const path = borderPath(r.w, r.h, item.style)
  const start = path.at(0)
  yield* agent.moveTo(() => {
    const rr = engine.rectOf(item)
    return { x: rr.x + start.x, y: rr.y + start.y }
  })
  d.pen(r.x, r.y, r.w, r.h, path.d, path.len)
  d.select(item)
  const pt = { x: 0, y: 0 }
  const dur = clamp(path.len * 0.42, 420, 1250)
  yield* tween(dur, (t) => {
    r = engine.rectOf(item)
    const dist = easeInOutSine(t) * path.len
    path.at(dist, pt)
    d.penProgress(dist, r.x, r.y)
    agent.x = r.x + pt.x
    agent.y = r.y + pt.y
  })
  engine.revealBorder(item)
  engine.showItem(item)
  yield* wait(240)
  d.hide('pen')
  yield* wait(80)
  engine.completeStep(item)
}

// Ruler: drag a red guide in from the page edge to the element's edge, then
// the element springs onto it.
function* guideStep(engine, agent, item) {
  const d = agent.decor
  const axis = item.opts.guide === 'y' ? 'y' : 'x'
  const base = item.rect
  const view = engine.view
  const guide = engine.addGuide(axis)
  if (axis === 'x') {
    const y = clamp(base.y + base.h / 2, view.top + 48, view.top + view.h - 90)
    yield* agent.moveTo({ x: 3, y })
    guide.set(0, y)
    const target = base.x
    yield* tween(clamp(260 + target * 0.6, 420, 1000), (t) => {
      const x = target * easeInOutCubic(t)
      guide.set(x, y)
      agent.x = x
      agent.y = y
    })
  } else {
    const x = clamp(base.x + Math.min(base.w, 220) / 2, 40, view.w - 60)
    const y0 = view.top + 3
    yield* agent.moveTo({ x, y: y0 })
    guide.set(y0, x)
    const target = base.y
    yield* tween(clamp(260 + (target - y0) * 0.6, 420, 1000), (t) => {
      const y = lerp(y0, target, easeInOutCubic(t))
      guide.set(y, x)
      agent.x = x
      agent.y = y
    })
  }
  guide.placed()
  engine.showItem(item)
  d.select(item)
  yield* wait(90)
  // Spring the element from its offset onto the guide.
  const sx = { x: item.offset.x, v: 0 }
  const sy = { x: item.offset.y, v: 0 }
  let settled = false
  while (!settled) {
    const dt = yield
    springTo(sx, 0, dt)
    springTo(sy, 0, dt)
    engine.setOffset(item, sx.x, sy.x)
    settled = Math.abs(sx.x) + Math.abs(sy.x) < 0.25 && Math.abs(sx.v) + Math.abs(sy.v) < 6
  }
  engine.setOffset(item, 0, 0)
  yield* wait(200)
  engine.completeStep(item)
}

// Cloner: hold ⌥, grab the group's first item and drag a ghost copy onto
// this sibling's position. A Typist retypes the sibling's text afterwards.
function* cloneStep(engine, agent, item) {
  const d = agent.decor
  const src = engine.groupSource(item)
  if (!src) {
    engine.showItem(item)
    engine.completeStep(item)
    return
  }
  const S = () => engine.rectOf(src)
  const T = () => engine.rectOf(item)
  let s = S()
  const grab = { x: Math.min(s.w * 0.5, 44), y: Math.min(s.h * 0.5, 20) }
  yield* agent.moveTo(() => {
    const r = S()
    return { x: r.x + grab.x, y: r.y + grab.y }
  })
  agent.setAlt(true)
  d.select(src)
  yield* wait(90)
  s = S()
  d.ghost(src, s.x, s.y, s.w, s.h)
  d.unselect()
  yield* agent.moveTo(
    () => {
      const t = T()
      return { x: t.x + grab.x * (t.w / s.w), y: t.y + grab.y * (t.h / s.h) }
    },
    {
      onFrame: (p) => {
        const t = T()
        const e = easeInOutCubic(clamp(p, 0, 1))
        const w = lerp(s.w, t.w, e)
        const h = lerp(s.h, t.h, e)
        d.ghost(src, agent.x - grab.x * (w / s.w), agent.y - grab.y * (h / s.h), w, h)
      },
    },
  )
  const t = T()
  d.ghost(src, t.x, t.y, t.w, t.h)
  engine.showItem(item)
  d.select(item)
  yield* wait(70)
  d.hide('ghost')
  agent.setAlt(false)
  yield* wait(110)
  engine.completeStep(item)
}
