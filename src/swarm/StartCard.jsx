import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { BASE_AGENTS, PALETTE } from './engine/config.js'
import { GATE_MS } from './engine/engine.js'
import { useSwarm } from './context.js'
import { SpeakerIcon } from './Toolbar.jsx'

const SECONDS = Math.round(GATE_MS / 1000)

// First visit: browsers only allow sound after a click, so before the build
// starts this card offers to play it with sound. With no choice made, the
// build starts muted when the countdown runs out.
export function StartCard() {
  const engine = useSwarm()
  const { gate } = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot)
  const open = gate !== 0
  const [mounted, setMounted] = useState(false)
  const [left, setLeft] = useState(SECONDS)
  const play = useRef(null)

  // Keyboard users land on "Play with sound"; the card stays mounted to fade out.
  useEffect(() => {
    if (open) {
      setMounted(true)
      play.current?.focus({ preventScroll: true })
      return undefined
    }
    const t = setTimeout(() => setMounted(false), 320)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open || gate === Infinity) return undefined
    const tick = () => setLeft(Math.max(1, Math.ceil((gate - performance.now()) / 1000)))
    tick()
    const id = setInterval(tick, 200)
    return () => clearInterval(id)
  }, [open, gate])

  if (!open && !mounted) return null
  const counting = open && gate !== Infinity
  const remaining = counting ? Math.max(0, gate - performance.now()) : GATE_MS

  return (
    <div className={`sw-gate${open ? '' : ' is-leaving'}`} data-sw-sound="">
      <div className="sw-gate-card" role="dialog" aria-labelledby="sw-gate-title">
        <span className="sw-gate-cursors" aria-hidden="true">
          {BASE_AGENTS.map((a) => (
            <svg key={a.name} viewBox="0 0 22 24" style={{ color: PALETTE[a.color].hex }}>
              <path
                d="M3 2.5 L3 19.5 L7.6 15.4 L10.9 22.2 L14 20.8 L10.8 14.2 L17 14.2 Z"
                fill="currentColor"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </span>
        <p id="sw-gate-title" className="sw-gate-title">
          {BASE_AGENTS.length} cursors are about to build this site, box by box.
        </p>
        <div className="sw-gate-actions">
          <button ref={play} type="button" className="sw-gate-btn is-primary" onClick={() => engine.openGate('sound')}>
            <SpeakerIcon on />
            Play with sound
          </button>
          <button type="button" className="sw-gate-btn" onClick={() => engine.openGate('muted')}>
            Play muted
          </button>
        </div>
        <p className="sw-gate-count">Starting muted in {left}…</p>
        <span className="sw-gate-timer" aria-hidden="true">
          <span
            key={gate}
            style={{ animationDuration: `${Math.round(remaining)}ms`, animationPlayState: counting ? 'running' : 'paused' }}
          />
        </span>
      </div>
    </div>
  )
}
