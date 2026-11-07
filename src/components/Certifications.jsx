import { certifications } from '../content.js'
import { Build } from '../swarm/Build.jsx'
import { SectionHeading } from './SectionHeading.jsx'

const ISSUER_STYLE = {
  AWS: 'bg-amber text-canvas',
  Oracle: 'bg-coral text-canvas',
}

export function Certifications() {
  return (
    <section id="certifications" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading>Certifications</SectionHeading>
      <ul className="mt-10 grid gap-3 sm:mt-12">
        {certifications.map((c) => (
          <Build
            as="li"
            key={c.name}
            group="certs"
            steps={['box', 'border']}
            label="row"
            className="rounded-xl border border-line bg-surface px-4 py-4 sm:px-6"
          >
            <Build as="div" steps={['text']} label="text" className="flex items-start gap-4 sm:items-center">
              <span
                className={`mt-0.5 inline-flex h-6 w-16 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold sm:mt-0 ${ISSUER_STYLE[c.issuer]}`}
              >
                {c.issuer}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="font-medium text-ink">{c.name}</span>
                <span className="shrink-0 font-mono text-[13px] text-muted">{c.date}</span>
              </span>
            </Build>
          </Build>
        ))}
      </ul>
    </section>
  )
}
