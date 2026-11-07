import { profile } from '../content.js'
import { Build } from '../swarm/Build.jsx'
import { SectionHeading } from './SectionHeading.jsx'
import { GitHubIcon, LinkedInIcon, RegMark } from './Icons.jsx'

export function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
      <RegMark className="top-24 right-6 hidden md:block" />
      <SectionHeading>Contact</SectionHeading>
      <Build
        as="a"
        href={`mailto:${profile.email}`}
        steps={['text']}
        label="link"
        className="text-link mt-8 block w-fit max-w-full font-display text-[clamp(1.35rem,6vw,3.75rem)] leading-tight font-semibold tracking-[-0.03em] [overflow-wrap:anywhere] text-ink hover:text-coral sm:mt-10"
      >
        {profile.email}
      </Build>
      <ul className="mt-8 flex flex-wrap gap-3 sm:mt-10">
        <li>
          <Build
            as="a"
            href={profile.github}
            target="_blank"
            rel="noopener"
            group="social"
            steps={['box', 'text']}
            label="button"
            className="btn"
          >
            <GitHubIcon />
            GitHub
          </Build>
        </li>
        <li>
          <Build
            as="a"
            href={profile.linkedin}
            target="_blank"
            rel="noopener"
            group="social"
            steps={['box', 'text']}
            label="button"
            className="btn"
          >
            <LinkedInIcon />
            LinkedIn
          </Build>
        </li>
      </ul>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative">
      <Build as="div" steps={['border']} label="rule" aria-hidden="true" className="absolute inset-x-0 top-0 h-0 border-t border-line" />
      <Build
        as="div"
        steps={['text']}
        label="footer"
        className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pt-8 pb-28 font-mono text-xs text-faint sm:flex-row sm:justify-between sm:px-6"
      >
        <p>Build animation inspired by Swarm by Joel Califa.</p>
        <p>© 2026 {profile.name}</p>
      </Build>
    </footer>
  )
}
