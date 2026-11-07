import { skills } from '../content.js'
import { Build } from '../swarm/Build.jsx'
import { PALETTE } from '../swarm/engine/config.js'
import { SectionHeading } from './SectionHeading.jsx'
import { InstanceIcon, RegMark } from './Icons.jsx'

// Grid placement per group, in content order: a two-row board of frames.
// Languages · Frameworks on top, Databases · Tools below.
const SPANS = ['sm:col-span-2 lg:col-span-4', 'lg:col-span-2', 'lg:col-span-3', 'sm:col-span-2 lg:col-span-3']

function Instance({ skill, group, color }) {
  return (
    <Build
      as="li"
      group={`skills-${group}`}
      steps={['text']}
      label="instance"
      className="skill-instance relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 text-[clamp(1.6rem,3.1vw,2.5rem)] leading-none"
    >
      {/* Icon sits on the name's line, even if the badge wraps below it. */}
      <InstanceIcon className="mt-[calc(0.5lh-7px)] size-3.5 shrink-0" style={{ color }} />
      <span className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
        <span className="font-display font-medium tracking-[-0.025em] whitespace-nowrap text-ink">{skill.name}</span>
        {skill.note && (
          <>
            <span className="sr-only" data-sw-skip="">
              ,{' '}
            </span>
            <span
              className="rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none whitespace-nowrap"
              style={{ color, borderColor: `${color}59` }}
            >
              {skill.note}
            </span>
          </>
        )}
      </span>
      <span className="skill-sel" aria-hidden="true" data-sw-skip="">
        <i />
        <i />
        <i />
        <i />
        <span className="skill-tag">{skill.name}</span>
      </span>
    </Build>
  )
}

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <RegMark className="top-24 right-4 hidden lg:block" />
      <SectionHeading>Skills</SectionHeading>
      <div className="mt-10 grid gap-x-5 gap-y-8 sm:mt-12 sm:grid-cols-2 lg:grid-cols-6">
        {skills.map((g, i) => {
          const color = PALETTE[g.accent].hex
          return (
            <div key={g.group} className={`group/frame flex flex-col ${SPANS[i]}`}>
              <Build
                as="h3"
                steps={['text']}
                label="label"
                className="mb-3 flex items-center gap-2 font-mono text-[12.5px] text-faint transition-colors group-hover/frame:text-select"
              >
                <span aria-hidden="true" style={{ color }}>
                  #
                </span>
                {g.group}
              </Build>
              <Build
                as="div"
                group="skill-frames"
                steps={['box', 'border']}
                label="frame"
                className="flex flex-1 items-center rounded-xl border border-line bg-surface px-6 py-8 transition-colors group-hover/frame:border-select/70 sm:px-8 sm:py-10"
              >
                <ul className="flex w-full flex-wrap items-center gap-x-10 gap-y-7">
                  {g.items.map((s) => (
                    <Instance key={s.name} skill={s} group={g.group} color={color} />
                  ))}
                </ul>
              </Build>
            </div>
          )
        })}
      </div>
    </section>
  )
}
