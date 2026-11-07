import { projects } from '../content.js'
import { Build } from '../swarm/Build.jsx'
import { PALETTE } from '../swarm/engine/config.js'
import { SectionHeading } from './SectionHeading.jsx'
import { ArrowUpRight, RegMark } from './Icons.jsx'
import { PROJECT_VISUALS } from './ProjectVisuals.jsx'

function ProjectCard({ project, index }) {
  const display = project.url.replace(/^https?:\/\//, '')
  const Visual = PROJECT_VISUALS[project.visual]
  // Visual and text swap sides down the page on wide screens.
  const flip = index % 2 === 1
  return (
    <Build
      as="article"
      group="projects"
      steps={['box', 'border']}
      label="card"
      style={{ '--accent': PALETTE[project.accent].hex }}
      className="project-card grid gap-7 rounded-2xl border border-line bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-10 lg:p-8"
    >
      {Visual && (
        <div className={`lg:self-center ${flip ? 'lg:order-2' : ''}`}>
          <Visual />
        </div>
      )}
      <div className="flex flex-col px-1 sm:px-2 lg:py-2">
        <Build as="header" steps={['text']} label="header">
          <p className="flex items-center gap-2.5 font-mono text-[13px] text-muted">
            <span className="size-2.5 rounded-[3px] bg-(--accent)" aria-hidden="true" />
            {project.date}
          </p>
          <h3 className="mt-3 font-display text-[2rem] leading-tight font-semibold tracking-[-0.025em] sm:text-[2.6rem]">
            {project.name}
          </h3>
          <p className="mt-1 text-[17px] text-muted">{project.summary}</p>
        </Build>
        <ul className="mt-6 grid gap-3.5">
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
        <div className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-5 lg:mt-auto">
          <Build as="ul" steps={['text']} label="stack" aria-label={`${project.name} tech stack`} className="flex flex-wrap gap-2">
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
            className="text-link inline-flex items-center gap-2 font-mono text-sm text-ink"
          >
            {display}
            <ArrowUpRight className="size-4" />
          </Build>
        </div>
      </div>
    </Build>
  )
}

export function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <RegMark className="top-16 -left-2 hidden xl:block" />
      <SectionHeading>Projects</SectionHeading>
      <div className="mt-10 grid gap-6 sm:mt-12">
        {projects.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}
