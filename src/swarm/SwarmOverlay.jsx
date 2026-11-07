// Covers the whole document (it sits inside the provider's relative root), so
// everything the engine draws here uses document coordinates.
export function SwarmOverlay({ ref }) {
  return (
    <div ref={ref} className="sw-overlay" aria-hidden="true">
      <div className="sw-layer sw-guides" />
      <div className="sw-layer sw-decor" />
      <div className="sw-layer sw-cursors" />
    </div>
  )
}
