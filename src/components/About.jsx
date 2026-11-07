import { about, education } from '../content.js'
import { Build } from '../swarm/Build.jsx'
import { SectionHeading } from './SectionHeading.jsx'
import { RegMark } from './Icons.jsx'

const card = 'mt-8 rounded-2xl border border-line bg-surface p-6 sm:mt-10 sm:p-8'

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <RegMark className="top-10 left-1/2 hidden md:block" />
      <div className="grid gap-16 md:grid-cols-2 md:gap-8">
        <div className="flex flex-col">
          <SectionHeading>Education</SectionHeading>
          <Build as="div" steps={['box', 'border']} label="card" className={`${card} flex-1`}>
            <Build as="header" steps={['text']} label="header">
              <h3 className="font-display text-2xl leading-snug font-semibold tracking-[-0.01em]">{education.school}</h3>
              <p className="mt-2 text-muted">{education.degree}</p>
            </Build>
            <Build
              as="dl"
              steps={['text']}
              label="dl"
              className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 font-mono text-[13px]"
            >
              <div>
                <dt className="text-faint">Years</dt>
                <dd className="mt-1 text-ink">{education.years}</dd>
              </div>
              <div>
                <dt className="text-faint">CGPA</dt>
                <dd className="mt-1 text-ink">{education.cgpa}</dd>
              </div>
            </Build>
          </Build>
        </div>
        <div className="flex flex-col">
          <SectionHeading>About</SectionHeading>
          <Build as="div" steps={['box', 'border']} label="card" className={`${card} flex flex-1 items-center`}>
            <Build as="p" steps={['text']} label="p" className="font-display text-[1.5rem] leading-snug tracking-[-0.01em] sm:text-[1.75rem]">
              {about}
            </Build>
          </Build>
        </div>
      </div>
    </section>
  )
}
