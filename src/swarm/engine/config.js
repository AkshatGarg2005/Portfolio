// Agent palette. These colours double as the site's accent colours.
// `label` is the background for name pills and tags, `ink` the text on it.
// Every pair passes WCAG AA; violet needs a deeper shade for that.
export const PALETTE = {
  coral: { hex: '#FF6B6B', label: '#FF6B6B', ink: '#0B1020' },
  mint: { hex: '#2DD4A7', label: '#2DD4A7', ink: '#0B1020' },
  violet: { hex: '#8B5CF6', label: '#7C3AED', ink: '#FFFFFF' },
  amber: { hex: '#FBBF24', label: '#FBBF24', ink: '#0B1020' },
  sky: { hex: '#38BDF8', label: '#38BDF8', ink: '#0B1020' },
  pink: { hex: '#F472B6', label: '#F472B6', ink: '#0B1020' },
}

export const COLOR_ORDER = ['coral', 'mint', 'violet', 'amber', 'sky', 'pink']

// The six agents that open every build.
export const BASE_AGENTS = [
  { name: 'Pixel', color: 'coral', role: 'boxer' },
  { name: 'Kern', color: 'mint', role: 'typist' },
  { name: 'Vec', color: 'violet', role: 'pen' },
  { name: 'Grid', color: 'amber', role: 'ruler' },
  { name: 'Snap', color: 'sky', role: 'cloner' },
  { name: 'Ink', color: 'pink', role: 'typist' },
]

// Names for the extra agents that join when the visitor scrolls ahead.
export const EXTRA_NAMES = [
  'Bez', 'Hue', 'Nudge', 'Glyph', 'Pad', 'Flex', 'Tint', 'Lasso',
  'Mask', 'Node', 'Pin', 'Path', 'Fill', 'Crop', 'Stack', 'Align',
  'Frame', 'Layer', 'Swatch', 'Blend', 'Snapx', 'Hint', 'Trim', 'Gap',
]

// Which role performs which kind of step.
export const KIND_ROLE = {
  box: 'boxer',
  image: 'boxer',
  text: 'typist',
  border: 'pen',
  guide: 'ruler',
  clone: 'cloner',
}

export const ROLES = ['boxer', 'typist', 'pen', 'ruler', 'cloner']

export const KINDS = Object.keys(KIND_ROLE)

export const TIMING = {
  // Typing
  charMin: 25,
  charMax: 36,
  wordModeAt: 40, // a text node longer than this many characters types a word at a time
  paragraphMin: 1000,
  paragraphMax: 2000,
  paragraphPerChar: 7,
  // Movement
  moveBase: 120,
  movePerPx: 0.32,
  moveMax: 760,
  // Tour scroll speed (px per second at 1×)
  tourSpeed: 620,
}
