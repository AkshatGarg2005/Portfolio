import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Absolute site URL for Open Graph tags. Set SITE_URL yourself, or let
// Vercel's production domain fill it in at build time.
function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  return ''
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'site-url',
      transformIndexHtml(html) {
        const url = siteUrl()
        // Without a known domain, leave out the tags that must be absolute.
        if (!url) {
          html = html
            .replace(/\s*<link rel="canonical"[^>]*>/, '')
            .replace(/\s*<meta property="og:url"[^>]*>/, '')
        }
        return html.replaceAll('%SITE_URL%', url)
      },
    },
  ],
})
