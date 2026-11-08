// Build sounds, made on the fly with the Web Audio API (no audio files).
//
// Each agent action has its own short sound, panned to where the agent is on
// screen, over a quiet pad that brightens as the page fills in. Browsers only
// allow sound after the visitor clicks, taps or presses a key. The start card
// asks for that click on a first visit; otherwise sound begins at the first
// gesture unless the visitor muted it (remembered in localStorage).

import { clamp, rand } from './math.js'

const PREF_KEY = 'swarm:sound'
const VOLUME = 0.8 // overall level, 0–1
const MAX_VOICES = 48 // sound sources playing at once; extras are dropped
const KEY_GAP = 0.035 // s between key clicks, however many agents type

// C major pentatonic, C5 to C6: each agent colour has its own note.
const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5]
const NOTE = { coral: 0, mint: 1, violet: 2, amber: 3, sky: 4, pink: 5 }
const PAD_NOTES = [130.81, 196, 293.66, 329.63] // C3 G3 D4 E4
const DONE_NOTES = [523.25, 659.25, 783.99, 987.77, 1174.66] // Cmaj9, rolled
const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click']

function readPref() {
  try {
    return localStorage.getItem(PREF_KEY) !== 'off'
  } catch {
    return true
  }
}

function savePref(on) {
  try {
    localStorage.setItem(PREF_KEY, on ? 'on' : 'off')
  } catch {
    /* storage can be blocked; the choice then lasts for this page only */
  }
}

export class SwarmSound {
  constructor(engine) {
    this.engine = engine
    this.ctx = null
    this.master = null
    this.noise = null
    this.pad = null
    this.building = false
    this.voices = 0
    this.lastKey = 0
    this.hidden = false
    this.pref = typeof window === 'undefined' ? true : readPref()
  }

  // 'on' (playing), 'waiting' (on, but the browser needs a gesture first) or 'off'.
  get state() {
    if (!this.pref) return 'off'
    return this.ctx && this.ctx.state === 'running' ? 'on' : 'waiting'
  }

  get live() {
    return this.pref && !!this.ctx && this.ctx.state === 'running'
  }

  attach() {
    for (const t of GESTURES) window.addEventListener(t, this.onGesture, { capture: true, passive: true })
    document.addEventListener('visibilitychange', this.onVisibility)
  }

  detach() {
    for (const t of GESTURES) window.removeEventListener(t, this.onGesture, { capture: true })
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.pad = null
    this.ctx?.close().catch(() => {})
    this.ctx = null
  }

  onGesture = (e) => {
    if (!this.pref || this.state === 'on') return
    // The sound button and the start card handle their own clicks.
    if (e.target instanceof Element && e.target.closest('[data-sw-sound]')) return
    this.unlock()
  }

  onVisibility = () => {
    if (!this.ctx) return
    if (document.hidden) {
      if (this.ctx.state === 'running') {
        this.hidden = true
        this.ctx.suspend().catch(() => {})
      }
    } else if (this.hidden) {
      this.hidden = false
      if (this.pref) this.ctx.resume().catch(() => {})
    }
  }

  // Must run inside a click, tap or key press. Resolves once audio is running.
  unlock() {
    // Creating a context without a gesture only earns a console warning.
    if (navigator.userActivation && !navigator.userActivation.isActive) return null
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return null
      this.ctx = new AC({ latencyHint: 'interactive' })
      this.setup()
      this.ctx.onstatechange = () => this.engine.emit()
    }
    // iOS only unlocks audio for a sound started inside the gesture.
    const blip = this.ctx.createBufferSource()
    blip.buffer = this.ctx.createBuffer(1, 1, 22050)
    blip.connect(this.ctx.destination)
    blip.start()
    this.master.gain.setTargetAtTime(VOLUME, this.ctx.currentTime, 0.05)
    return this.ctx
      .resume()
      .then(() => {
        if (this.building) this.startPad()
        this.engine.emit()
      })
      .catch(() => {})
  }

  // Sound on, remembered. Must run inside a click, tap or key press.
  enable() {
    this.pref = true
    savePref(true)
    const running = this.unlock()
    this.engine.emit()
    return running
  }

  // Sound off, remembered.
  mute() {
    this.pref = false
    savePref(false)
    const ctx = this.ctx
    if (ctx) {
      this.stopPad(0.2)
      this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.04)
      setTimeout(() => {
        if (!this.pref && ctx.state === 'running') ctx.suspend().catch(() => {})
      }, 300)
    }
    this.engine.emit()
  }

  toggle() {
    if (this.state === 'on') this.mute()
    else this.enable()
  }

  setup() {
    const ctx = this.ctx
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -20
    comp.knee.value = 18
    comp.ratio.value = 3.5
    comp.attack.value = 0.004
    comp.release.value = 0.2
    this.master = ctx.createGain()
    this.master.gain.value = 0
    this.master.connect(comp)
    comp.connect(ctx.destination)
    // One second of white noise, shared by every noisy sound.
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    this.noise = buf
  }

  // ------------------------------------------------------------- building blocks

  can(n = 1) {
    return this.live && this.voices + n <= MAX_VOICES
  }

  track(src) {
    this.voices++
    src.onended = () => {
      this.voices--
    }
  }

  // Engine time (ms, scaled by speed) to real seconds.
  real(ms) {
    return ms / 1000 / Math.max(1, this.engine.speed * this.engine.boost)
  }

  // Output for one sound, panned to where the agent is on screen.
  out(agent) {
    const ctx = this.ctx
    if (!agent || !ctx.createStereoPanner) return this.master
    const p = ctx.createStereoPanner()
    p.pan.value = clamp((agent.x / (this.engine.view.w || 1)) * 2 - 1, -1, 1) * 0.6
    p.connect(this.master)
    return p
  }

  env(param, t, peak, attack, decay) {
    param.setValueAtTime(0.0001, t)
    param.exponentialRampToValueAtTime(peak, t + attack)
    param.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  }

  tone({ f, f2, type = 'sine', t, peak, attack = 0.005, decay, dest }) {
    const ctx = this.ctx
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(f, t)
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + attack + decay * 0.6)
    const g = ctx.createGain()
    this.env(g.gain, t, peak, attack, decay)
    o.connect(g)
    g.connect(dest)
    o.start(t)
    o.stop(t + attack + decay + 0.05)
    this.track(o)
  }

  hiss({ t, attack = 0.002, decay, peak, type = 'bandpass', f, f2, q = 1, dest }) {
    const ctx = this.ctx
    const s = ctx.createBufferSource()
    s.buffer = this.noise
    const bf = ctx.createBiquadFilter()
    bf.type = type
    bf.Q.value = q
    bf.frequency.setValueAtTime(f, t)
    if (f2) bf.frequency.exponentialRampToValueAtTime(f2, t + attack + decay)
    const g = ctx.createGain()
    this.env(g.gain, t, peak, attack, decay)
    s.connect(bf)
    bf.connect(g)
    g.connect(dest)
    s.start(t, rand(0, 0.5))
    s.stop(t + attack + decay + 0.05)
    this.track(s)
  }

  // -------------------------------------------------------------- agent sounds

  // An agent joins: a soft note in its colour. The six that open the build
  // arrive 60 ms apart, so they play as a little run up the scale.
  join(agent, delay = 0) {
    if (!this.can(2)) return
    const t = this.ctx.currentTime + delay
    const f = SCALE[NOTE[agent.colorName] ?? 0]
    const dest = this.out(agent)
    const peak = agent.extra ? 0.035 : 0.06
    this.tone({ f, t, peak, attack: 0.008, decay: 0.32, dest })
    this.tone({ f: f * 2, t, peak: peak / 4, attack: 0.005, decay: 0.18, dest })
  }

  leave(agent) {
    if (!this.can()) return
    const f = SCALE[NOTE[agent.colorName] ?? 0]
    this.tone({ f: f * 0.75, f2: f * 0.5, t: this.ctx.currentTime, peak: 0.025, decay: 0.2, dest: this.out(agent) })
  }

  // Typist: a key click (a tick of noise and a low thock).
  key(agent) {
    if (!this.live) return
    const t = this.ctx.currentTime
    if (t - this.lastKey < KEY_GAP || !this.can(2)) return
    this.lastKey = t
    const dest = this.out(agent)
    this.hiss({ t, decay: 0.028, peak: 0.2, f: rand(2600, 4200), q: 1.4, dest })
    this.tone({ f: rand(170, 230), f2: 110, t, peak: 0.07, attack: 0.002, decay: 0.035, dest })
  }

  // Boxer drags a frame: a swoosh that opens up as the frame grows.
  drag(agent, ms) {
    if (!this.can()) return
    const d = this.real(ms)
    this.hiss({ t: this.ctx.currentTime, attack: d * 0.6, decay: d * 0.4, peak: 0.045, f: 500, f2: 1800, q: 0.9, dest: this.out(agent) })
  }

  // Something lands: a short drop in pitch, in the agent's key.
  place(agent) {
    if (!this.can()) return
    const f = SCALE[NOTE[agent.colorName] ?? 0] / 2
    this.tone({ f: f * 1.5, f2: f, t: this.ctx.currentTime, peak: 0.12, attack: 0.004, decay: 0.12, dest: this.out(agent) })
  }

  // Pen traces a border: a marker scribble that wobbles as it goes.
  pen(agent, ms) {
    if (!this.can(2)) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const d = this.real(ms)
    const s = ctx.createBufferSource()
    s.buffer = this.noise
    s.loop = true
    const bf = ctx.createBiquadFilter()
    bf.type = 'bandpass'
    bf.Q.value = 2.5
    bf.frequency.setValueAtTime(1300, t)
    bf.frequency.linearRampToValueAtTime(1900, t + d)
    const trem = ctx.createGain()
    trem.gain.value = 0.6
    const lfo = ctx.createOscillator()
    lfo.frequency.value = rand(9, 13)
    const depth = ctx.createGain()
    depth.gain.value = 0.4
    lfo.connect(depth)
    depth.connect(trem.gain)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.04, t + 0.05)
    g.gain.setValueAtTime(0.04, t + Math.max(0.05, d - 0.08))
    g.gain.exponentialRampToValueAtTime(0.0001, t + d)
    s.connect(bf)
    bf.connect(trem)
    trem.connect(g)
    g.connect(this.out(agent))
    s.start(t, rand(0, 0.5))
    lfo.start(t)
    s.stop(t + d + 0.05)
    lfo.stop(t + d + 0.05)
    this.track(s)
    this.track(lfo)
  }

  // Ruler: the guide snaps into place.
  snap(agent) {
    if (!this.can(2)) return
    const t = this.ctx.currentTime
    const dest = this.out(agent)
    this.hiss({ t, attack: 0.001, decay: 0.012, peak: 0.09, type: 'highpass', f: 3000, q: 0.7, dest })
    this.tone({ type: 'triangle', f: 1760, t, peak: 0.045, attack: 0.002, decay: 0.06, dest })
  }

  // Cloner picks up a copy: two quick notes, a fifth apart.
  clone(agent) {
    if (!this.can(2)) return
    const t = this.ctx.currentTime
    const f = SCALE[NOTE[agent.colorName] ?? 4]
    const dest = this.out(agent)
    this.tone({ f, t, peak: 0.05, decay: 0.09, dest })
    this.tone({ f: f * 1.5, t: t + 0.06, peak: 0.05, decay: 0.14, dest })
  }

  // A picture wipes in: a quick sparkle up the scale over a soft whoosh.
  wipe(agent, ms) {
    if (!this.can(6)) return
    const t = this.ctx.currentTime
    const d = this.real(ms)
    const dest = this.out(agent)
    this.hiss({ t, attack: d * 0.5, decay: d * 0.5, peak: 0.02, type: 'highpass', f: 2000, f2: 6000, q: 0.7, dest })
    SCALE.slice(0, 5).forEach((f, i) => {
      this.tone({ f: f * 2, t: t + (d * i) / 5, peak: 0.028, attack: 0.004, decay: 0.35, dest })
    })
  }

  // ----------------------------------------------------------- the whole build

  buildStart() {
    this.stopPad(0.3)
    this.building = true
    this.startPad()
  }

  // finished: true when the page is complete (plays the closing chord).
  buildEnd(finished) {
    if (!this.building) return
    this.building = false
    this.stopPad(finished ? 2.4 : 0.4)
    if (finished && this.can(DONE_NOTES.length * 2)) {
      const t = this.ctx.currentTime + 0.05
      DONE_NOTES.forEach((f, i) => {
        const at = t + i * 0.075
        this.tone({ f, t: at, peak: 0.07, attack: 0.006, decay: 1.6, dest: this.master })
        this.tone({ f: f * 2.01, t: at, peak: 0.015, attack: 0.004, decay: 0.6, dest: this.master })
      })
    }
  }

  // The pad brightens as the page fills in (p from 0 to 1).
  setProgress(p) {
    if (this.pad) this.pad.lp.frequency.setTargetAtTime(380 + p * 1000, this.ctx.currentTime, 2)
  }

  startPad() {
    if (this.pad || !this.live) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const out = ctx.createGain()
    out.gain.setValueAtTime(0, t)
    out.gain.linearRampToValueAtTime(0.03, t + 3)
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.Q.value = 0.7
    lp.frequency.value = 380
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.07
    const sweep = ctx.createGain()
    sweep.gain.value = 120
    lfo.connect(sweep)
    sweep.connect(lp.frequency)
    const oscs = [lfo]
    for (const f of PAD_NOTES) {
      for (const cents of [-7, 7]) {
        const o = ctx.createOscillator()
        o.type = 'sawtooth'
        o.frequency.value = f
        o.detune.value = cents
        const g = ctx.createGain()
        g.gain.value = 0.18
        o.connect(g)
        g.connect(lp)
        oscs.push(o)
      }
    }
    lp.connect(out)
    out.connect(this.master)
    for (const o of oscs) o.start(t)
    this.pad = { out, lp, oscs }
  }

  stopPad(fade) {
    const pad = this.pad
    if (!pad) return
    this.pad = null
    const t = this.ctx.currentTime
    const g = pad.out.gain
    g.cancelScheduledValues(t)
    g.setValueAtTime(g.value, t)
    g.linearRampToValueAtTime(0, t + fade)
    for (const o of pad.oscs) o.stop(t + fade + 0.05)
  }
}
