// Text handling for the Typist.
//
// A "plan" lists the text nodes of an element (skipping nested buildables) and
// the units the Typist reveals: single characters for short text, whole words
// for long paragraphs. While typing, each text node is swapped for a wrapper
// of per-unit spans that start transparent, so line wrapping stays exactly as
// in the finished page. When typing ends, the original text nodes go back.

import { TIMING } from './config.js'

const WS = /\s/

export function collectTextNodes(root) {
  const out = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.nodeType === 1) {
        if (node !== root && node.hasAttribute('data-build')) return NodeFilter.FILTER_REJECT
        if (node.classList.contains('sw-sr') || node.hasAttribute('data-sw-skip')) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_SKIP
      }
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) out.push(walker.currentNode)
  return out
}

export function buildPlan(el) {
  const nodes = collectTextNodes(el)
  let chars = 0
  // Each text node picks its own mode: a title types letter by letter, a long
  // sentence next to it types a word at a time.
  const units = [] // { node, start, end, text, word, nodeChars }
  for (const node of nodes) {
    const s = node.nodeValue
    const nodeChars = s.replace(/\s+/g, '').length
    chars += nodeChars
    const word = nodeChars > TIMING.wordModeAt
    let i = 0
    while (i < s.length) {
      if (WS.test(s[i])) {
        i++
        continue
      }
      if (!word) {
        const cp = s.codePointAt(i)
        const len = cp > 0xffff ? 2 : 1
        units.push({ node, start: i, end: i + len, text: s.slice(i, i + len), word, nodeChars })
        i += len
      } else {
        let j = i
        while (j < s.length && !WS.test(s[j])) j++
        units.push({ node, start: i, end: j, text: s.slice(i, j), word, nodeChars })
        i = j
      }
    }
  }
  const mode = units.some((u) => u.word) ? 'word' : 'char'
  // Boxes between the text and the element (chips in a list, spans in a row).
  // Their sizes are locked while the text is split so nothing shifts.
  const inner = []
  const seen = new Set()
  for (const n of nodes) {
    for (let p = n.parentElement; p && p !== el; p = p.parentElement) {
      if (seen.has(p)) continue
      seen.add(p)
      inner.push({ el: p, w: 0, h: 0, display: 'inline' })
    }
  }
  return {
    mode,
    nodes,
    units,
    chars,
    inner,
    // filled in by measureUnits: caret positions per unit, root coordinates
    boxes: units.map(() => ({ x0: 0, x1: 0, y: 0, h: 0 })),
    split: null, // { wrappers: [[wrapper, originalNode]], spans: [] }
  }
}

// Reads the on-screen position of every unit. Uses Range rects on the original
// text (no DOM changes needed) or the unit spans while the text is split.
export function measureUnits(plan, rootRect) {
  for (const box of plan.inner) {
    const r = box.el.getBoundingClientRect()
    box.w = r.width
    box.h = r.height
    box.display = getComputedStyle(box.el).display
  }
  const range = plan.split ? null : document.createRange()
  for (let i = 0; i < plan.units.length; i++) {
    let first
    let last
    if (plan.split) {
      const r = plan.split.spans[i].getBoundingClientRect()
      first = r
      last = r
    } else {
      const u = plan.units[i]
      if (!u.node.isConnected) continue
      range.setStart(u.node, u.start)
      range.setEnd(u.node, u.end)
      const rects = range.getClientRects()
      if (!rects.length) continue
      first = rects[0]
      last = rects[rects.length - 1]
    }
    const b = plan.boxes[i]
    b.x0 = first.left - rootRect.left
    b.x1 = last.right - rootRect.left
    b.y = last.top - rootRect.top
    b.h = last.height
  }
  if (!plan.split) {
    const b = plan.boxes
    plan.singleLine = b.length > 0 && b.every((x) => Math.abs(x.y - b[0].y) < 2)
  }
}

export function splitText(plan) {
  if (plan.split) return
  const wrappers = []
  const spans = []
  let u = 0
  for (const node of plan.nodes) {
    if (!node.parentNode) continue
    const s = node.nodeValue
    const wrap = document.createElement('span')
    wrap.setAttribute('data-sw-split', '')
    // A one-line text could otherwise wrap if the split copy renders a
    // fraction of a pixel wider than the original.
    if (plan.singleLine) wrap.style.whiteSpace = 'nowrap'
    const vis = document.createElement('span')
    vis.setAttribute('aria-hidden', 'true')
    let cursor = 0
    while (u < plan.units.length && plan.units[u].node === node) {
      const unit = plan.units[u]
      if (unit.start > cursor) vis.appendChild(document.createTextNode(s.slice(cursor, unit.start)))
      const span = document.createElement('span')
      span.className = 'sw-u'
      span.textContent = unit.text
      vis.appendChild(span)
      spans.push(span)
      cursor = unit.end
      u++
    }
    if (cursor < s.length) vis.appendChild(document.createTextNode(s.slice(cursor)))
    // Screen readers get the untouched text while the visible copy is split.
    const sr = document.createElement('span')
    sr.className = 'sw-sr'
    sr.textContent = s
    wrap.append(vis, sr)
    node.parentNode.replaceChild(wrap, node)
    wrappers.push([wrap, node])
  }
  plan.split = { wrappers, spans }
}

export function restoreText(plan) {
  if (!plan || !plan.split) return
  for (const [wrap, node] of plan.split.wrappers) {
    if (wrap.parentNode) wrap.parentNode.replaceChild(node, wrap)
  }
  plan.split = null
}

// Delay before each unit appears, in ms at 1× speed.
export function typingDelays(plan, rnd) {
  const n = plan.units.length
  const out = new Array(n)
  // Words per text node, to spread a paragraph's duration over its words.
  const words = new Map()
  for (const u of plan.units) if (u.word) words.set(u.node, (words.get(u.node) || 0) + 1)
  const pace = new Map()
  for (let i = 0; i < n; i++) {
    const u = plan.units[i]
    const prev = plan.units[i - 1]
    if (u.word) {
      // A paragraph takes 1–3 s in total, so each word gets a share of that.
      if (!pace.has(u.node)) {
        const total = Math.min(TIMING.paragraphMax, Math.max(TIMING.paragraphMin, u.nodeChars * TIMING.paragraphPerChar))
        pace.set(u.node, (total * rnd(0.9, 1.1)) / words.get(u.node))
      }
      const base = pace.get(u.node)
      out[i] = base * rnd(0.6, 1.35) + (/[.,;:]$/.test(prev?.text || '') ? base * 0.4 : 0)
    } else {
      // Small extra beat at the start of each new word.
      const newWord = prev && (prev.node !== u.node || prev.end < u.start)
      out[i] = rnd(TIMING.charMin, TIMING.charMax) + (newWord ? rnd(0, 20) : 0)
    }
  }
  return out
}
