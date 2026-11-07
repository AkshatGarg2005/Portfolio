import { useContext, useId, useLayoutEffect, useRef } from 'react'
import { BuildParentContext, SwarmContext } from './context.js'
import { KINDS } from './engine/config.js'

const DEFAULT_STEPS = {
  box: ['box'],
  text: ['text'],
  image: ['image'],
  border: ['border'],
  guide: ['guide'],
  clone: ['box', 'text'],
}

/**
 * Registers an element with the swarm.
 *
 *   kind   one of box | text | image | border | guide | clone (shorthand)
 *   steps  explicit step list, e.g. ['box', 'border', 'text']
 *   group  clone group id: the first item builds normally, the rest are
 *          Option-dragged copies whose text is retyped
 *   guide  'x' (default) or 'y': which edge a guide step snaps to
 *   label  tag shown on the selection outline (defaults to the tag name)
 *   spawn  agents spawn around this element
 */
export function useBuildable(ref, { kind = 'box', steps, group, label, guide, spawn } = {}) {
  const engine = useContext(SwarmContext)
  const parentId = useContext(BuildParentContext)
  const id = useId()
  const list = steps ?? DEFAULT_STEPS[kind] ?? DEFAULT_STEPS.box
  const key = list.join(' ')

  if (import.meta.env.DEV) {
    for (const k of list) if (!KINDS.includes(k)) console.warn(`[swarm] unknown step "${k}"`)
    if (kind === 'clone' && !group) console.warn('[swarm] kind="clone" needs a group id')
  }

  useLayoutEffect(() => {
    const el = ref.current
    if (!engine || !el) return undefined
    engine.register(id, el, { steps: key.split(' '), group, label, guide, spawn, parentId })
    return () => engine.unregister(id)
  }, [engine, id, key, group, label, guide, spawn, parentId, ref])

  return { id, key }
}

export function Build({ as: Tag = 'div', kind, steps, group, label, guide, spawn, children, ...rest }) {
  const ref = useRef(null)
  const { id, key } = useBuildable(ref, { kind, steps, group, label, guide, spawn })
  return (
    <BuildParentContext.Provider value={id}>
      <Tag ref={ref} data-build={key} {...rest}>
        {children}
      </Tag>
    </BuildParentContext.Provider>
  )
}
