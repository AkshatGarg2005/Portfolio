import { useEffect, useRef } from 'react'
import { profile } from '../content.js'
import { Build } from '../swarm/Build.jsx'
import { FileIcon, GitHubIcon, LinkedInIcon, RegMark } from './Icons.jsx'

const clamp1 = (v) => Math.max(-1, Math.min(1, v))

// While the pointer is level with the hero, the picture turns a little
// toward it. Sets --tx and --ty (-1 to 1) on the picture's wrapper; CSS does
// the rest. The float pauses while the hero is scrolled out of view.
function useTilt(sectionRef, artRef) {
  useEffect(() => {
    const section = sectionRef.current
    const art = artRef.current
    if (!section || !art) return undefined
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true
    let frame = 0
    let px = 0
    let py = 0
    const set = (x, y) => {
      art.style.setProperty('--tx', x.toFixed(3))
      art.style.setProperty('--ty', y.toFixed(3))
    }
    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0
      set(0, 0)
    }
    const apply = () => {
      frame = 0
      const s = section.getBoundingClientRect()
      if (py < s.top || py > s.bottom) return set(0, 0)
      const a = art.getBoundingClientRect()
      set(clamp1((px - (a.left + a.width / 2)) / (window.innerWidth / 2)), clamp1((py - (a.top + a.height / 2)) / (s.height / 2)))
    }
    const move = (e) => {
      if (!visible || !fine.matches || still.matches) return
      px = e.clientX
      py = e.clientY
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      art.classList.toggle('is-away', !visible)
      if (!visible) reset()
    })
    io.observe(section)
    const root = document.documentElement
    window.addEventListener('pointermove', move, { passive: true })
    root.addEventListener('pointerleave', reset)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', reset)
    }
  }, [sectionRef, artRef])
}

export function Hero() {
  const [role, stack] = profile.role.split(' · ')
  const sectionRef = useRef(null)
  const artRef = useRef(null)
  useTilt(sectionRef, artRef)
  return (
    <section ref={sectionRef} id="top" className="relative mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
      <RegMark className="top-6 right-6 hidden lg:block" />
      <RegMark className="bottom-10 left-1 hidden lg:block" />
      {/* The text column keeps room for the four buttons on one row; the picture
          takes the rest, and on wide screens reaches into the page margin. */}
      <div className="grid gap-8 sm:gap-12 lg:grid-cols-[minmax(560px,1fr)_minmax(0,1fr)] lg:items-center lg:gap-8 xl:gap-10">
        <div className="order-2 lg:order-1">
          <Build as="p" steps={['text']} typing="char" label="p" className="font-mono text-[13px] text-muted sm:text-sm">
            <span className="text-ink">{role}</span>
            <span className="text-faint"> · </span>
            {stack}
          </Build>
          <Build
            as="h1"
            steps={['text', 'guide']}
            guide="x"
            label="h1"
            className="mt-4 font-display text-[clamp(3.5rem,10.5vw,8.25rem)] leading-[0.88] font-bold tracking-[-0.045em] sm:mt-6"
          >
            <span className="block">Akshat</span>
            <span className="block">Garg</span>
          </Build>
          <Build
            as="p"
            steps={['text']}
            label="p"
            className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-muted sm:mt-8 sm:text-lg"
          >
            {profile.sub}
          </Build>
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
            <Build as="a" href="#projects" steps={['box', 'text']} label="button" className="btn btn-primary">
              View projects
            </Build>
            <Build
              as="a"
              href={profile.resume}
              target="_blank"
              rel="noopener"
              group="cta"
              steps={['box', 'border', 'text']}
              label="button"
              className="btn"
            >
              <FileIcon />
              Resume
            </Build>
            <Build
              as="a"
              href={profile.github}
              target="_blank"
              rel="noopener"
              group="cta"
              steps={['box', 'border', 'text']}
              label="button"
              className="btn"
            >
              <GitHubIcon />
              GitHub
            </Build>
            <Build
              as="a"
              href={profile.linkedin}
              target="_blank"
              rel="noopener"
              group="cta"
              steps={['box', 'border', 'text']}
              label="button"
              className="btn"
            >
              <LinkedInIcon />
              LinkedIn
            </Build>
          </div>
        </div>
        <div ref={artRef} className="hero-art order-1 lg:order-2">
          {/* A transparent cut-out with no frame. The desk floats, its light
              spills onto the canvas below, and it turns toward the pointer. */}
          <Build
            as="div"
            kind="image"
            label="img"
            className="relative w-full max-w-[360px] sm:max-w-[460px] lg:max-w-none xl:w-[calc(100%+48px)] 2xl:w-[calc(100%+96px)]"
          >
            <span className="hero-glow hero-halo" aria-hidden="true" />
            <span className="hero-glow hero-spill" aria-hidden="true" />
            <img
              src={profile.photo.src}
              srcSet={profile.photo.srcSet}
              sizes={profile.photo.sizes}
              width={profile.photo.width}
              height={profile.photo.height}
              alt="3D illustration of Akshat Garg coding at a desk"
              fetchPriority="high"
              decoding="async"
              className="hero-img relative block h-auto w-full"
            />
          </Build>
        </div>
      </div>
    </section>
  )
}
