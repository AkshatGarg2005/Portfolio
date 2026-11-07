import { useEffect, useRef, useState } from 'react'
import { SwarmContext } from './context.js'
import { SwarmEngine } from './engine/engine.js'
import { SwarmOverlay } from './SwarmOverlay.jsx'
import { Toolbar } from './Toolbar.jsx'

export function SwarmProvider({ children }) {
  const [engine] = useState(() => new SwarmEngine())
  const rootRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    if (import.meta.env.DEV) window.__swarm = engine
    engine.attach(rootRef.current, overlayRef.current)
    // The inline script in index.html already decided: first visit in this
    // session and no reduced-motion preference means the intro plays.
    if (document.documentElement.getAttribute('data-swarm') === 'play') engine.start()
    else engine.setMode('live')
    return () => engine.detach()
  }, [engine])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (engine.mode === 'loading' || engine.mode === 'building' || engine.mode === 'done') {
          e.preventDefault()
          engine.close()
        }
      } else if (e.altKey && e.shiftKey && e.code === 'KeyS') {
        e.preventDefault()
        engine.replay()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [engine])

  return (
    <SwarmContext.Provider value={engine}>
      <div ref={rootRef} className="relative">
        {children}
        <SwarmOverlay ref={overlayRef} />
      </div>
      <Toolbar />
    </SwarmContext.Provider>
  )
}
