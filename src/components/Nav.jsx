import { navLinks, profile } from '../content.js'
import { Build } from '../swarm/Build.jsx'
import { useSwarm } from '../swarm/context.js'
import { CursorMark, RebuildIcon } from './Icons.jsx'

export function Nav() {
  const engine = useSwarm()
  return (
    <Build as="header" steps={['border']} label="header" className="border-b border-line">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Build
          as="a"
          href="#top"
          steps={['text']}
          label="logo"
          spawn
          className="flex items-center gap-2.5 font-display text-[17px] font-semibold tracking-tight"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-coral text-canvas" aria-hidden="true">
            <CursorMark className="size-4" />
          </span>
          {profile.name}
        </Build>
        <div className="flex items-center">
          <ul className="hidden items-center md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Build
                  as="a"
                  href={l.href}
                  group="nav"
                  steps={['text']}
                  label="link"
                  className="block rounded-md px-3 py-2 font-mono text-[13px] text-muted transition-colors hover:text-ink"
                >
                  {l.label}
                </Build>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => engine?.replay()}
            title="Watch the swarm build this page again (Alt+Shift+S)"
            className="sw-rebuild ml-3 inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line-strong px-3.5 font-mono text-[12.5px] text-ink transition-colors hover:border-ink/50 hover:bg-raised"
          >
            <RebuildIcon className="size-4" />
            Rebuild
          </button>
        </div>
      </nav>
    </Build>
  )
}
