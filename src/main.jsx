import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is prerendered (see scripts/prerender.mjs), so hydrate it;
// the dev server serves an empty root, so render from scratch.
if (container.firstElementChild) hydrateRoot(container, app)
else createRoot(container).render(app)
