import { Fragment } from 'react'
import { certifications } from '../content.js'
import { Build } from '../swarm/Build.jsx'
import { PALETTE } from '../swarm/engine/config.js'
import { SectionHeading } from './SectionHeading.jsx'
import { CloudIcon, CupIcon, LayersIcon, RegMark, SparkleIcon } from './Icons.jsx'

const ISSUER_COLOR = { AWS: PALETTE.amber.hex, Oracle: PALETTE.coral.hex }
const ICONS = { cloud: CloudIcon, ai: SparkleIcon, architect: LayersIcon, java: CupIcon }
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const monthIndex = (date) => {
  const [m, y] = date.split(' ')
  return Number(y) * 12 + MONTHS.indexOf(m)
}

// Original hexagon emblem with an icon for the certificate's subject.
function Emblem({ cert, latest }) {
  const Icon = ICONS[cert.icon]
  const color = ISSUER_COLOR[cert.issuer]
  return (
    <span className="relative grid size-12 shrink-0 place-items-center" style={{ color }} aria-hidden="true">
      <svg viewBox="0 0 48 48" className="cert-hex absolute inset-0 size-full overflow-visible">
        <path
          d="M24 2.5 42.6 13.25v21.5L24 45.5 5.4 34.75v-21.5Z"
          fill="currentColor"
          fillOpacity={latest ? 1 : 0.14}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {Icon && <Icon className={`relative size-5 ${latest ? 'text-canvas' : ''}`} />}
    </span>
  )
}

// A prototype-style connection between two certificates, traced by the Pen.
function Flow({ index }) {
  return (
    <Build
      as="li"
      steps={['border']}
      waitFor="certs"
      label="flow"
      aria-hidden="true"
      style={{ '--i': index }}
      className="cert-flow relative ml-[39px] h-8 w-0 border-l-2 border-dashed border-select/60 sm:ml-[47px] lg:mx-1 lg:h-0 lg:w-auto lg:self-center lg:border-t-2 lg:border-l-0"
    >
      <i className="cert-flow-head" />
    </Build>
  )
}

export function Certifications() {
  // Oldest first, so the path reads left to right (top to bottom on phones).
  const path = [...certifications].reverse()
  const months = monthIndex(path[path.length - 1].date) - monthIndex(path[0].date)
  return (
    <section id="certifications" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <RegMark className="top-20 right-6 hidden lg:block" />
      <SectionHeading>Certifications</SectionHeading>
      <ol className="cert-path mt-10 grid sm:mt-12 lg:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)_2.5rem_minmax(0,1fr)_2.5rem_minmax(0,1fr)]">
        {path.map((c, i) => {
          const latest = i === path.length - 1
          return (
            <Fragment key={c.name}>
              {i > 0 && <Flow index={i - 1} />}
              <Build
                as="li"
                group="certs"
                steps={['box', 'border']}
                label="card"
                style={{ '--issuer': ISSUER_COLOR[c.issuer] }}
                className={`cert-card flex gap-4 rounded-xl border border-line bg-surface p-4 sm:gap-5 sm:p-6 lg:flex-col lg:gap-6 lg:p-5${latest ? ' is-latest' : ''}`}
              >
                <Emblem cert={c} latest={latest} />
                <Build as="div" steps={['text']} label="text" className="flex min-w-0 flex-1 flex-col">
                  <p className="font-mono text-[12px] text-muted">
                    {c.issuer} · {c.date}
                  </p>
                  <h3 className="mt-2 font-display text-[1.1rem] leading-snug font-semibold tracking-[-0.01em] sm:text-[1.2rem]">
                    {c.name}
                  </h3>
                  <p className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                    <span className="rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none" style={{ color: ISSUER_COLOR[c.issuer], borderColor: `${ISSUER_COLOR[c.issuer]}59` }}>
                      {c.level}
                    </span>
                    {latest && <span className="font-mono text-[11px] leading-none text-muted">Latest</span>}
                  </p>
                </Build>
              </Build>
            </Fragment>
          )
        })}
      </ol>
      {months > 0 && (
        <Build
          as="div"
          steps={['border', 'text']}
          waitFor="certs"
          label="measure"
          className="cert-measure relative mt-10 border-t border-guide/80 sm:mt-12"
        >
          <span className="sr-only" data-sw-skip="">
            From the first certificate to the latest:{' '}
          </span>
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-guide px-2 py-0.5 font-mono text-[11px] leading-[1.4] font-semibold whitespace-nowrap text-canvas">
            {months} months
          </span>
        </Build>
      )}
    </section>
  )
}
