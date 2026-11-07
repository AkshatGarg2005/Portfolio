const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
}

export const GitHubIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </svg>
)

export const LinkedInIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <path d="M2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export const FileIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </svg>
)

export const ArrowUpRight = (p) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const RebuildIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 4v5h5" />
    <path d="M5.1 15a7.5 7.5 0 1 0 1.4-7.9L4 9" />
  </svg>
)

export const CheckIcon = (p) => (
  <svg {...base} strokeWidth={3} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const LeafIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z" />
    <path d="M5 19 13 11" />
  </svg>
)

export const SparkleIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.5 13.9 10l6.6 2-6.6 2L12 20.5 10.1 14l-6.6-2 6.6-2z" fill="currentColor" />
  </svg>
)

// A paper plane, the shape of a sent alert.
export const PlaneIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M21 3 3 10.5l7 2.5 2.5 7z" />
    <path d="m10 13 4.5-4.5" />
  </svg>
)

export const CloudIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.6 4.5 4.5 0 0 0 7 18.5z" />
  </svg>
)

// Stacked layers: a solution's architecture.
export const LayersIcon = (p) => (
  <svg {...base} {...p}>
    <path d="m12 3 9 4.5-9 4.5-9-4.5z" />
    <path d="m3 12 9 4.5 9-4.5" />
    <path d="m3 16.5 9 4.5 9-4.5" />
  </svg>
)

// A steaming cup, the old Java mark's idea without the logo.
export const CupIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 10h12v4.5A5.5 5.5 0 0 1 10.5 20h-1A5.5 5.5 0 0 1 4 14.5z" />
    <path d="M16 11.5h1.5a2.5 2.5 0 0 1 0 5H16" />
    <path d="M8 3.5c-.8 1 .8 2 0 3M12 3.5c-.8 1 .8 2 0 3" />
  </svg>
)

// Outline diamond: a design tool's mark for a component instance.
export const InstanceIcon = (p) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...p}>
    <path d="M8 1.8 14.2 8 8 14.2 1.8 8Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)

// The site mark: a cursor arrow, the swarm's own shape.
export const CursorMark = (p) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...p}>
    <path
      d="M5 3.5v15.2l4.1-3.7 3 6.2 2.9-1.3-3-6.1h5.7z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
)

// "+" registration mark, part of the empty canvas.
export const RegMark = ({ className = '' }) => (
  <svg
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
    className={`pointer-events-none absolute size-4 text-line-strong ${className}`}
  >
    <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)
