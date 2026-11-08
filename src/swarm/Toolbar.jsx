import { useSyncExternalStore } from 'react'
import { PALETTE } from './engine/config.js'
import { useSwarm } from './context.js'

const SPEEDS = [1, 2, 3]
const MAX_DOTS = 12

const SOUND_TITLE = {
  on: 'Mute build sounds',
  waiting: 'Sound starts at your first click. Click here to start it now',
  off: 'Play build sounds',
}

export function SpeakerIcon({ on }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 6h2.2L8 3.2v9.6L4.7 10H2.5z" fill="currentColor" />
      {on ? (
        <path d="M10.6 5.6a3.4 3.4 0 0 1 0 4.8M12.6 3.8a6 6 0 0 1 0 8.4" />
      ) : (
        <path d="m10.8 6.2 3.6 3.6m0-3.6-3.6 3.6" />
      )}
    </svg>
  )
}

export function Toolbar() {
  const engine = useSwarm()
  const snap = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot)
  const { mode, speed, tour, sound, built, total, agents } = snap
  if (mode !== 'building' && mode !== 'done' && mode !== 'leaving') return null

  const done = mode !== 'building'
  const pct = total ? Math.round((built / total) * 1000) / 10 : 0
  const dots = agents.slice(0, MAX_DOTS)
  const spread = Math.max(dots.length - 1, 5)
  // Longest the count can get, so its box is sized once and never moves.
  const digits = String(total).length
  const wide = 2 + ' agents · '.length + digits * 2 + ' / '.length + ' layers'.length
  const narrow = 2 + ' · '.length + digits * 2 + ' / '.length
  const tiny = 1 + digits * 2 + ' / '.length
  const nextSpeed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]

  return (
    <div className={`sw-toolbar${mode === 'leaving' ? ' is-leaving' : ''}`} role="region" aria-label="Site build controls">
      <div className="sw-bar">
        {/* Dots squeeze closer as the swarm grows, so the bar never resizes. */}
        <span className="sw-dots" aria-hidden="true">
          {dots.map((c, i) => (
            <i key={i} style={{ background: PALETTE[c].hex, left: `calc((100% - 10px) * ${(i / spread).toFixed(3)})` }} />
          ))}
        </span>
        <span className="sw-count" style={{ '--cw': `${wide}ch`, '--cn': `${narrow}ch`, '--cx': `${tiny}ch` }}>
          <span className="sw-n">
            {agents.length}
            <span className="sw-wide"> agents</span> ·{' '}
          </span>
          {built} / {total}
          <span className="sw-wide"> layers</span>
        </span>
        <span className="sw-sep" aria-hidden="true" />
        <button
          type="button"
          className={`sw-btn sw-sound${sound === 'waiting' ? ' is-waiting' : ''}`}
          data-sw-sound=""
          aria-label="Build sounds"
          aria-pressed={sound === 'on'}
          title={SOUND_TITLE[sound]}
          onClick={() => engine.sound.toggle()}
        >
          <SpeakerIcon on={sound === 'on'} />
        </button>
        {/* Both button sets share one grid cell, so the bar keeps its width
            when the build finishes and the buttons swap. */}
        <span className="sw-controls">
          <span className={`sw-set is-done${done ? '' : ' is-off'}`} inert={!done}>
            <button type="button" className="sw-btn is-primary" onClick={() => engine.goLive()}>
              Go live
            </button>
            <button type="button" className="sw-btn" onClick={() => engine.replay()}>
              Replay
            </button>
          </span>
          <span className={`sw-set${done ? ' is-off' : ''}`} inert={done}>
            <span className="sw-seg" role="group" aria-label="Build speed">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="sw-btn"
                  aria-pressed={speed === s}
                  onClick={() => engine.setSpeed(s)}
                >
                  {s}×
                </button>
              ))}
            </span>
            <button
              type="button"
              className="sw-btn sw-speed-cycle"
              aria-label={`Build speed ${speed}×. Switch to ${nextSpeed}×`}
              onClick={() => engine.setSpeed(nextSpeed)}
            >
              {speed}×
            </button>
            <button type="button" className="sw-btn" aria-pressed={tour} onClick={() => engine.setTour(!tour)}>
              Tour
            </button>
            <button type="button" className="sw-btn" onClick={() => engine.skip()}>
              Skip
            </button>
            <button
              type="button"
              className="sw-btn sw-close"
              aria-label="Close the build and show the live site"
              onClick={() => engine.close()}
            >
              ×
            </button>
          </span>
        </span>
        <span
          className="sw-progress"
          role="progressbar"
          aria-label="Build progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={built}
        >
          <span style={{ width: `${pct}%` }} />
        </span>
      </div>
    </div>
  )
}
