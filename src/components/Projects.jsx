import { projects } from '../content.js'
import { Build } from '../swarm/Build.jsx'
import { PALETTE } from '../swarm/engine/config.js'
import { SectionHeading } from './SectionHeading.jsx'
import { ArrowUpRight, RegMark } from './Icons.jsx'

function ProjectCard({ project }) {
  const display = project.url.replace(/^https?:\/\//, '')
  return (
    <Build
      as="article"
      group="projects"
      steps={['box', 'border']}
      label="card"
      style={{ '--accent': PALETTE[project.accent].hex }}
      className="grid gap-7 rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-0 lg:p-10"
    >
      <div className="flex flex-col items-start lg:pr-10">
        <Build as="header" steps={['text']} label="header">
          <p className="flex items-center gap-2.5 font-mono text-[13px] text-muted">
            <span className="size-2.5 rounded-[3px] bg-(--accent)" aria-hidden="true" />
            {project.date}
          </p>
          <h3 className="mt-4 font-display text-[2rem] leading-tight font-semibold tracking-[-0.02em] sm:text-[2.5rem]">
            {project.name}
          </h3>
          <p className="mt-1.5 text-[17px] text-muted">{project.summary}</p>
        </Build>
        <Build
          as="ul"
          steps={['text']}
          label="stack"
          aria-label={`${project.name} tech stack`}
          className="mt-6 flex flex-wrap gap-2"
        >
          {project.stack.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </Build>
        <Build
          as="a"
          href={project.url}
          target="_blank"
          rel="noopener"
          steps={['text']}
          label="link"
          aria-label={`${project.name} live site: ${display}`}
          className="text-link mt-7 inline-flex items-center gap-2 font-mono text-sm text-ink lg:mt-auto lg:pt-8"
        >
          {display}
          <ArrowUpRight className="size-4" />
        </Build>
      </div>
      <ul className="grid content-start gap-4 border-t border-line pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
        {project.points.map((point) => (
          <Build
            as="li"
            key={point}
            steps={['text']}
            label="li"
            className="relative pl-6 text-[15.5px] leading-relaxed text-ink/90 before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-3 before:bg-(--accent)"
          >
            {point}
          </Build>
        ))}
      </ul>
    </Build>
  )
}

export function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <RegMark className="top-16 -left-2 hidden xl:block" />
      <SectionHeading>Projects</SectionHeading>
      <div className="mt-10 grid gap-6 sm:mt-12">
        {projects.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </div>
    </section>
  )
}
