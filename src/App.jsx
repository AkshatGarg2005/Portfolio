import { useEffect } from 'react'
import { SwarmProvider } from './swarm/SwarmProvider.jsx'
import { Nav } from './components/Nav.jsx'
import { Hero } from './components/Hero.jsx'
import { Projects } from './components/Projects.jsx'
import { Skills } from './components/Skills.jsx'
import { Certifications } from './components/Certifications.jsx'
import { About } from './components/About.jsx'
import { Contact, Footer } from './components/Contact.jsx'

// In-page links glide to their section (instantly with reduced motion).
// Done in JS rather than CSS scroll-behavior so the Tour can scroll instantly.
function useSmoothAnchors() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href').slice(1)
      const target = id ? document.getElementById(id) : null
      if (!target) return
      e.preventDefault()
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      history.pushState(null, '', `#${id}`)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}

export default function App() {
  useSmoothAnchors()
  return (
    <SwarmProvider>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-select px-3 py-2 font-mono text-sm text-canvas focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Projects />
        <Skills />
        <Certifications />
        <About />
        <Contact />
      </main>
      <Footer />
    </SwarmProvider>
  )
}
