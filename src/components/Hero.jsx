import { profile } from '../content.js'
import { Build } from '../swarm/Build.jsx'
import { FileIcon, GitHubIcon, LinkedInIcon, RegMark } from './Icons.jsx'

export function Hero() {
  const [role, stack] = profile.role.split(' · ')
  return (
    <section id="top" className="relative mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
      <RegMark className="top-6 right-6 hidden lg:block" />
      <RegMark className="bottom-10 left-1 hidden lg:block" />
      <div className="grid gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-16">
        <div className="order-2 lg:order-1">
          <Build as="p" steps={['text']} label="p" className="font-mono text-[13px] text-muted sm:text-sm">
            <span className="text-ink">{role}</span>
            <span className="text-faint"> · </span>
            {stack}
          </Build>
          <Build
            as="h1"
            steps={['text', 'guide']}
            guide="x"
            label="h1"
            className="mt-4 font-display text-[clamp(3.5rem,10.5vw,8.25rem)] leading-[0.88] font-bold tracking-[-0.045em] sm:mt-6"
          >
            <span className="block">Akshat</span>
            <span className="block">Garg</span>
          </Build>
          <Build
            as="p"
            steps={['text']}
            label="p"
            className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-muted sm:mt-8 sm:text-lg"
          >
            {profile.sub}
          </Build>
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
            <Build as="a" href="#projects" steps={['box', 'text']} label="button" className="btn btn-primary">
              View projects
            </Build>
            <Build
              as="a"
              href={profile.resume}
              target="_blank"
              rel="noopener"
              group="cta"
              steps={['box', 'border', 'text']}
              label="button"
              className="btn"
            >
              <FileIcon />
              Resume
            </Build>
            <Build
              as="a"
              href={profile.github}
              target="_blank"
              rel="noopener"
              group="cta"
              steps={['box', 'border', 'text']}
              label="button"
              className="btn"
            >
              <GitHubIcon />
              GitHub
            </Build>
            <Build
              as="a"
              href={profile.linkedin}
              target="_blank"
              rel="noopener"
              group="cta"
              steps={['box', 'border', 'text']}
              label="button"
              className="btn"
            >
              <LinkedInIcon />
              LinkedIn
            </Build>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <Build
            as="div"
            kind="image"
            label="img"
            className="aspect-[4/5] w-[168px] overflow-hidden rounded-[20px] bg-[#d9d9d7] sm:w-[260px] lg:w-[360px] lg:rounded-[28px]"
          >
            <img
              src={profile.photo.src}
              srcSet={profile.photo.srcSet}
              sizes={profile.photo.sizes}
              width={profile.photo.width}
              height={profile.photo.height}
              alt="Portrait of Akshat Garg"
              fetchPriority="high"
              decoding="async"
              className="size-full object-cover object-[50%_30%]"
            />
          </Build>
        </div>
      </div>
    </section>
  )
}
