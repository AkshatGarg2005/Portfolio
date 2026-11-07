import { about, education, interests } from '../content.js'
import { Build } from '../swarm/Build.jsx'
import { PALETTE } from '../swarm/engine/config.js'
import { SectionHeading } from './SectionHeading.jsx'
import { BookIcon, CursorMark, FilmIcon, PinIcon, RegMark } from './Icons.jsx'

const NOTE_ICONS = { film: FilmIcon, book: BookIcon, pin: PinIcon }

// Where each sticky note starts on the board, and its tilt.
const NOTE_SPOTS = [
  { style: { left: '1%', top: '6%' }, rotate: -5 },
  { style: { left: '30%', top: '42%' }, rotate: 3.5 },
  { style: { right: '1%', top: '2%' }, rotate: -2.5 },
]

// --- Education: a version-history style timeline, newest first -------------

function EducationEntry({ entry }) {
  const color = PALETTE[entry.tone].hex
  return (
    <Build
      as="li"
      group="edu"
      steps={['box', 'border']}
      label="card"
      style={{ '--tone': color }}
      className={`edu-card relative rounded-xl border border-line bg-surface p-5 sm:p-6${entry.current ? ' is-current' : ''}`}
    >
      {/* Node on the timeline, just outside the card. */}
      <span className="edu-node absolute top-7 -left-[25px] size-3.5 rounded-full border-2 sm:-left-[29px]" aria-hidden="true" />
      <Build as="div" steps={['text']} label="text" className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="min-w-0 flex-1 basis-56">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] text-muted">
            {entry.years}
            {entry.current && (
              <span className="inline-flex items-center gap-1.5 text-mint">
                <i className="live-dot size-1.5 rounded-full bg-mint" aria-hidden="true" />
                In progress
              </span>
            )}
          </p>
          <h3 className="mt-2 font-display text-[1.2rem] leading-snug font-semibold tracking-[-0.01em] sm:text-[1.35rem]">
            {entry.title}
          </h3>
          <p className="mt-1 text-[15px] text-muted">{entry.school}</p>
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="font-display text-[2.25rem] leading-none font-semibold tracking-[-0.03em]" style={{ color }}>
            {entry.score}
          </p>
          <p className="mt-1.5 font-mono text-[11px] text-muted">{entry.scoreLabel}</p>
        </div>
      </Build>
      <div className="mt-5 h-1.5 rounded-full bg-line" aria-hidden="true">
        <Build
          as="span"
          steps={['box']}
          label="meter"
          className="edu-meter block h-full rounded-full"
          style={{ width: `${(entry.value * 100).toFixed(2)}%`, background: color }}
        />
      </div>
    </Build>
  )
}

function Education() {
  return (
    <div className="mt-8 sm:mt-10">
      {/* Each card draws the timeline segment down to the next node (see .edu-card in CSS). */}
      <ol className="relative grid gap-4 pl-8 sm:pl-10">
        {education.map((entry) => (
          <EducationEntry key={entry.title} entry={entry} />
        ))}
      </ol>
    </div>
  )
}

// --- About: a board with sticky notes the visitor can drag around --------

let topNote = 10

function dragNote(e) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  const note = e.currentTarget
  const board = note.closest('.about-board')
  if (!board) return
  e.preventDefault()
  const b = board.getBoundingClientRect()
  const r = note.getBoundingClientRect()
  const [tx = 0, ty = 0] = (note.style.translate || '').split(' ').map((v) => parseFloat(v) || 0)
  const start = { x: e.clientX, y: e.clientY }
  const pad = 8
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
  note.setPointerCapture(e.pointerId)
  note.classList.add('is-dragging')
  note.style.zIndex = String(++topNote)
  const move = (ev) => {
    const dx = clamp(ev.clientX - start.x, b.left + pad - r.left, b.right - pad - r.right)
    const dy = clamp(ev.clientY - start.y, b.top + pad - r.top, b.bottom - pad - r.bottom)
    note.style.translate = `${(tx + dx).toFixed(1)}px ${(ty + dy).toFixed(1)}px`
  }
  const end = () => {
    note.classList.remove('is-dragging')
    note.removeEventListener('pointermove', move)
    note.removeEventListener('pointerup', end)
    note.removeEventListener('pointercancel', end)
  }
  note.addEventListener('pointermove', move)
  note.addEventListener('pointerup', end)
  note.addEventListener('pointercancel', end)
}

function StickyNote({ note, spot }) {
  const Icon = NOTE_ICONS[note.icon]
  return (
    <Build
      as="div"
      group="notes"
      steps={['box']}
      label="sticky"
      onPointerDown={dragNote}
      style={{ ...spot.style, rotate: `${spot.rotate}deg`, background: PALETTE[note.tone].hex }}
      className="sticky-note absolute flex w-[128px] cursor-grab touch-none flex-col gap-3 rounded-[3px] p-3.5 font-display text-[15px] leading-tight font-semibold text-canvas select-none sm:w-[150px] sm:p-4 sm:text-[17px]"
    >
      {Icon && <Icon className="size-5" />}
      {note.label}
    </Build>
  )
}

function AboutBoard() {
  return (
    <Build
      as="div"
      steps={['box', 'border']}
      label="board"
      className="about-board relative mt-8 flex flex-1 flex-col rounded-2xl border border-line bg-surface p-6 sm:mt-10 sm:p-8"
    >
      <Build as="p" steps={['text']} label="p" className="max-w-[26ch] font-display text-[1.45rem] leading-snug tracking-[-0.01em] sm:text-[1.7rem]">
        {about}
      </Build>
      <div className="relative mt-6 min-h-[190px] flex-1 sm:min-h-[240px]" aria-hidden="true">
        {interests.map((note, i) => (
          <StickyNote key={note.label} note={note} spot={NOTE_SPOTS[i % NOTE_SPOTS.length]} />
        ))}
      </div>
      <p className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[11px] text-faint" aria-hidden="true">
        <CursorMark className="size-3" />
        Drag the notes around
      </p>
    </Build>
  )
}

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <RegMark className="top-10 left-1/2 hidden md:block" />
      <div className="grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
        <div>
          <SectionHeading>Education</SectionHeading>
          <Education />
        </div>
        <div className="flex flex-col">
          <SectionHeading>About</SectionHeading>
          <AboutBoard />
        </div>
      </div>
    </section>
  )
}
