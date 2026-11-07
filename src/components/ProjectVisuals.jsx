// Lo-fi wireframes of each project, drawn by the swarm during the build:
// frames and rows are boxed, borders traced and repeated rows Option-dragged.
// They are illustrations, not screenshots, so they are hidden from screen
// readers; every fact they hint at is in the project's text.
import { Build } from '../swarm/Build.jsx'
import { CheckIcon, LeafIcon, PlaneIcon, SparkleIcon } from './Icons.jsx'
import { INTELLIQRHELP_QR } from './qr.js'

const Bar = ({ w, tone = 'bg-line-strong', h = 'h-1.5' }) => (
  <span className={`block shrink-0 rounded-full ${h} ${tone}`} style={{ width: w }} />
)

// The app window. The first one is boxed and outlined; the others are copies.
function Panel({ children, className = '' }) {
  return (
    <Build
      as="div"
      group="project-visual"
      steps={['box', 'border']}
      label="frame"
      aria-hidden="true"
      className={`flex min-h-[236px] flex-col overflow-hidden rounded-xl border border-line-strong/70 bg-[#0c1226] p-4 sm:h-[340px] sm:p-5 lg:h-[400px] ${className}`}
    >
      {children}
    </Build>
  )
}

function WindowBar() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex gap-1.5">
        <i className="size-2 rounded-full bg-coral/70" />
        <i className="size-2 rounded-full bg-amber/70" />
        <i className="size-2 rounded-full bg-mint/70" />
      </span>
      <span className="h-4 w-2/5 rounded-full border border-line bg-raised" />
    </div>
  )
}

// --- Om Academy: an attendance register with fee status flags --------------

const REGISTER = [
  { name: '62%', days: [1, 1, 0, 1, 1, 1, 1], fee: 'paid' },
  { name: '48%', days: [1, 1, 1, 1, 0, 1, 1], fee: 'paid' },
  { name: '56%', days: [1, 0, 1, 1, 1, 1, 0], fee: 'due' },
  { name: '40%', days: [0, 1, 1, 0, 1, 1, 1], fee: 'overdue' },
]
const STATS = [
  { tone: 'bg-coral/70', w: '58%' },
  { tone: 'bg-mint/70', w: '72%' },
  { tone: 'bg-amber/70', w: '46%' },
]
const FEE = {
  paid: 'border-mint/50 bg-mint/15',
  due: 'border-amber/50 bg-amber/20',
  overdue: 'fee-overdue border-coral/70 bg-coral/30',
}

export function OmAcademyVisual() {
  return (
    <Panel>
      <WindowBar />
      <div className="mt-4 flex flex-1 gap-4">
        <div className="hidden w-[24%] shrink-0 flex-col gap-1.5 rounded-lg border border-line bg-raised/60 p-3 sm:flex">
          <span className="mb-2 flex items-center gap-2">
            <i className="size-3.5 rounded bg-coral/80" />
            <Bar w="55%" />
          </span>
          {['70%', '48%', '40%', '60%'].map((w, i) => (
            <span key={w} className={`flex h-6 items-center gap-2 rounded-md px-2 ${i === 0 ? 'bg-coral/15' : ''}`}>
              <i className={`size-2 shrink-0 rounded-sm ${i === 0 ? 'bg-coral' : 'bg-line-strong'}`} />
              <Bar w={w} tone={i === 0 ? 'bg-coral/60' : 'bg-line-strong'} />
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="mb-2 hidden grid-cols-3 gap-2 lg:grid">
            {STATS.map((st) => (
              <span key={st.tone} className="flex flex-col gap-2.5 rounded-md border border-line bg-raised/60 p-3">
                <i className={`size-3 rounded ${st.tone}`} />
                <Bar w={st.w} h="h-2.5" />
                <Bar w="42%" tone="bg-line" />
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 px-3 pb-1">
            <span className="w-[30%]">
              <Bar w="45%" tone="bg-line" />
            </span>
            <span className="flex gap-1.5">
              {[...'MTWTFSS'].map((d, i) => (
                <i key={i} className="h-1 w-2.5 rounded-full bg-line" />
              ))}
            </span>
            <span className="ml-auto">
              <Bar w="2.5rem" tone="bg-line" />
            </span>
          </div>
          {REGISTER.map((row, r) => (
            <Build
              as="div"
              key={r}
              group="om-register"
              steps={['box']}
              label="row"
              className="flex items-center gap-3 rounded-md border border-line bg-raised px-3 py-2.5"
            >
              <span className="flex w-[30%] items-center gap-2">
                <i className="size-4 shrink-0 rounded-full bg-line-strong" />
                <Bar w={row.name} />
              </span>
              <span className="flex gap-1.5">
                {row.days.map((present, d) => (
                  <i
                    key={d}
                    className={`att-dot size-2.5 rounded-full ${present ? 'bg-mint' : 'bg-line-strong'}`}
                    style={{ '--i': r * 7 + d }}
                  />
                ))}
              </span>
              <span className={`ml-auto h-4 w-10 shrink-0 rounded-full border ${FEE[row.fee]}`} />
            </Build>
          ))}
          <div className="mt-auto flex items-center gap-3 px-1 pt-3">
            <Bar w="18%" tone="bg-line" />
            <span className="h-1.5 flex-1 rounded-full bg-line">
              <span className="block h-full w-[86%] rounded-full bg-coral/70" />
            </span>
          </div>
        </div>
      </div>
    </Panel>
  )
}

// --- Nourishfy: an AI meal plan beside a grocery checklist ---------------

const MEALS = ['62%', '46%', '70%']
const GROCERIES = [
  { w: '72%', done: true },
  { w: '54%', done: true },
  { w: '66%', done: false },
  { w: '42%', done: false },
  { w: '58%', done: false },
  { w: '48%', done: false },
]

export function NourishfyVisual() {
  return (
    <Panel>
      <WindowBar />
      <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-mint/30 bg-mint/10 px-3 py-2">
        <SparkleIcon className="size-3.5 shrink-0 text-mint" />
        <Bar w="44%" tone="bg-mint/40" />
        <span className="ml-auto h-4 w-12 shrink-0 rounded-full bg-mint/70" />
      </div>
      <div className="mt-3 grid min-h-0 flex-1 grid-cols-[1.25fr_1fr] gap-3">
        <div className="flex flex-col justify-between gap-2">
          {MEALS.map((w, i) => (
            <Build
              as="div"
              key={i}
              group="nourishfy-meals"
              steps={['box']}
              label="meal"
              className="flex items-center gap-3 rounded-md border border-line bg-raised p-2 sm:p-2.5"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded bg-mint/15 sm:size-12 lg:size-14">
                <LeafIcon className="size-4 text-mint/80 lg:size-5" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">
                <Bar w={w} />
                <Bar w="34%" tone="bg-line" />
                <span className="hidden gap-1 sm:flex">
                  <i className="h-1.5 w-5 rounded-full bg-coral/50" />
                  <i className="h-1.5 w-4 rounded-full bg-amber/50" />
                  <i className="h-1.5 w-6 rounded-full bg-sky/50" />
                </span>
              </span>
            </Build>
          ))}
        </div>
        <Build as="div" steps={['box']} label="list" className="flex flex-col justify-between gap-2.5 rounded-md border border-line bg-raised p-3">
          <Bar w="46%" tone="bg-line" />
          {GROCERIES.map((g, i) => (
            <span key={i} className="flex items-center gap-2">
              <i className={`nf-check grid size-3.5 shrink-0 place-items-center rounded-[4px] border${g.done ? ' is-done' : ''}`} style={{ '--i': i - 2 }}>
                <CheckIcon className="size-2.5 text-canvas" />
              </i>
              <Bar w={g.w} />
            </span>
          ))}
          <span className="hidden items-center justify-between border-t border-line pt-2.5 sm:flex">
            <Bar w="34%" tone="bg-line" />
            <i className="h-3.5 w-10 rounded-full bg-amber/40" />
          </span>
        </Build>
      </div>
    </Panel>
  )
}

// --- IntelliQrHelp: the QR medical profile, an SOS button and the alert ---

function QrCode() {
  const { size, path } = INTELLIQRHELP_QR
  // A real code: scanning it opens the live app.
  return (
    <svg viewBox={`-2 -2 ${size + 4} ${size + 4}`} className="block h-auto w-full" shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={size + 4} height={size + 4} fill="#fff" />
      <path d={path} fill="#0B1020" />
    </svg>
  )
}

export function IntelliQrVisual() {
  return (
    <Panel>
      <div className="flex w-full flex-1 items-center justify-center gap-4 sm:gap-7">
        <Build
          as="div"
          steps={['box', 'border']}
          label="phone"
          className="flex h-[204px] w-[112px] shrink-0 flex-col items-center rounded-[20px] border-2 border-line-strong bg-raised px-2.5 pt-2 pb-2.5 sm:h-[292px] sm:w-[160px] sm:rounded-[26px] sm:px-3.5 sm:pb-3.5 lg:h-[340px] lg:w-[186px] lg:px-4"
        >
          <span className="h-1.5 w-9 rounded-full bg-line-strong" />
          <span className="mt-2.5 flex w-full items-center gap-2 sm:mt-4">
            <i className="size-4 shrink-0 rounded-full bg-violet/50 sm:size-5" />
            <span className="flex flex-1 flex-col gap-1">
              <Bar w="80%" />
              <Bar w="50%" tone="bg-line" />
            </span>
          </span>
          <Build as="div" kind="image" label="qr" className="mt-2.5 w-full overflow-hidden rounded-md sm:mt-3.5 sm:rounded-lg">
            <QrCode />
          </Build>
          <span className="mt-2.5 flex w-full gap-1.5 sm:mt-3">
            <i className="h-2.5 flex-1 rounded bg-coral/30 sm:h-3" />
            <i className="h-2.5 flex-1 rounded bg-amber/25 sm:h-3" />
            <i className="h-2.5 flex-1 rounded bg-sky/25 sm:h-3" />
          </span>
          {/* Profile details (allergies, conditions, next of kin) on bigger screens. */}
          <span className="mt-3 hidden w-full flex-col gap-2.5 lg:flex">
            {['56%', '42%'].map((w) => (
              <span key={w} className="flex items-center gap-2">
                <Bar w="26%" tone="bg-line" />
                <Bar w={w} />
              </span>
            ))}
          </span>
          <Build
            as="div"
            steps={['box', 'text']}
            label="button"
            className="sos mt-auto w-full rounded-full bg-coral py-1 text-center font-display text-xs leading-5 font-bold tracking-[0.08em] text-canvas sm:py-1.5 sm:text-sm"
          >
            SOS
          </Build>
        </Build>
        <Build as="div" steps={['box']} label="alerts" className="flex w-[42%] max-w-[200px] flex-col gap-2.5 self-end pb-1 sm:pb-2">
          {['92%', '70%'].map((w, i) => (
            <div
              key={w}
              className="tg-msg flex flex-col gap-2 rounded-2xl rounded-bl-[4px] border border-sky/35 bg-sky/10 p-3"
              style={{ '--i': i }}
            >
              <span className="flex items-center gap-2">
                <PlaneIcon className="size-4 shrink-0 text-sky" />
                <Bar w="55%" tone="bg-sky/50" />
              </span>
              <Bar w={w} />
              {i === 0 && <Bar w="64%" tone="bg-line" />}
            </div>
          ))}
        </Build>
      </div>
    </Panel>
  )
}

export const PROJECT_VISUALS = {
  om: OmAcademyVisual,
  nourishfy: NourishfyVisual,
  intelliqr: IntelliQrVisual,
}
