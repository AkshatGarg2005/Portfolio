import { Build } from '../swarm/Build.jsx'

// Section titles are typed, then a Ruler drags a guide to their left edge and
// they snap onto it.
export function SectionHeading({ children, className = '' }) {
  return (
    <Build
      as="h2"
      steps={['text', 'guide']}
      guide="x"
      label="h2"
      className={`font-display text-[2.25rem] leading-none font-semibold tracking-[-0.03em] sm:text-5xl ${className}`}
    >
      {children}
    </Build>
  )
}
