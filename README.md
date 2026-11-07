# Akshat Garg · Portfolio

My personal site. On a visitor's first load it opens as an empty design canvas,
and a swarm of multiplayer-style cursors builds the page in front of them: boxes
dragged out with live size badges, borders traced by a pen, headings snapped to
red ruler guides, repeated items Option-dragged into place, and every word typed
out. Then the page goes live.

Built with Vite, React 19 and Tailwind CSS 4. The swarm engine is hand-written
(one `requestAnimationFrame` loop, no animation library).

## Run it

Requires Node 20.19+ or 22.12+ (Vite 8).

```bash
npm install
npm run dev        # http://localhost:5173
```

The intro plays once per browser session. To see it again, use the **Rebuild**
button in the nav, press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd>, or open
the site in a new tab.

## Build

```bash
npm run build      # outputs dist/
npm run preview    # serves dist/ at http://localhost:4173
```

`npm run build` does three things:

1. `vite build` bundles the site into `dist/`.
2. `vite build --ssr src/entry-server.jsx` builds a server copy of the app.
3. `scripts/prerender.mjs` renders the page to HTML and writes it into
   `dist/index.html`, so all content is in the HTML file for search engines and
   link previews. The browser then hydrates it.

## Deploy to Vercel

**Dashboard:** push this folder to GitHub, then in Vercel choose
*Add New → Project*, import the repo and click *Deploy*. `vercel.json` already
sets the build command (`npm run build`) and output folder (`dist`).

**CLI:**

```bash
npx vercel          # preview deployment
npx vercel --prod   # production deployment
```

Open Graph tags need an absolute URL. On Vercel this is filled in
automatically from the project's production domain. To use a custom domain, or
to deploy somewhere else, set it at build time:

```bash
SITE_URL=https://akshatgarg.dev npm run build
```

Without a site URL, the canonical and `og:url` tags are left out and the
preview image path stays relative.

## Editing content

All text, links and dates live in `src/content.js`. The sections are in
`src/components/`.

- **Skills:** each skill can have a `note`, shown as a small badge (for
  example "3 projects"). Only add one that the projects or certifications on
  the page back up.

- **Photo:** `public/akshat.jpg` is the original. The page loads two smaller
  copies, `akshat-480.jpg` and `akshat-800.jpg`. If you replace the photo,
  regenerate them, e.g. on macOS:
  `sips -s format jpeg -s formatOptions 60 --resampleWidth 800 public/akshat.jpg --out public/akshat-800.jpg`
  (and the same with `480` and quality `62`).
- **Resume:** replace `public/Akshat_Garg_Resume.pdf`.
- **Link preview image:** `public/og.jpg` (1200 × 630) is a screenshot of the
  hero. Retake it if the hero changes.

## The swarm, in short

| Piece | File | Job |
| --- | --- | --- |
| `SwarmProvider` | `src/swarm/SwarmProvider.jsx` | Creates the engine, starts it on first visit, handles Esc and Alt+Shift+S |
| `<Build>` / `useBuildable` | `src/swarm/Build.jsx` | Registers an element and its build steps |
| `SwarmOverlay` | `src/swarm/SwarmOverlay.jsx` | Full-height layer for cursors, guides, outlines, badges and the caret |
| `Toolbar` | `src/swarm/Toolbar.jsx` | Agent count, layer count, speed, Tour, Skip, Go live, Replay |
| Engine | `src/swarm/engine/engine.js` | Measuring, scheduling, scroll following, extra agents, Tour, end state |
| Agents | `src/swarm/engine/agent.js` | Cursor, name pill, bezier movement, per-agent drawing chrome |
| Steps | `src/swarm/engine/tasks.js` | What each role does: box, image, text, border, guide, clone |
| Text | `src/swarm/engine/text.js` | Splits text into hidden per-character or per-word spans and restores it |
| Timing | `src/swarm/engine/config.js` | Agent names, colours, roles, typing and movement speeds |

Mark anything buildable with `<Build>`:

```jsx
<Build as="h2" steps={['text', 'guide']} label="h2">Projects</Build>

<Build as="article" group="projects" steps={['box', 'border']} label="card">
  …
</Build>
```

- **Step kinds:** `box`, `text`, `image`, `border`, `guide`, `clone`. Steps run
  in order, and a nested `<Build>` waits until its parent is finished.
- **`group`** makes a clone group. The first item builds with its own steps. The
  rest are Option-dragged copies, and a Typist then retypes their text.
- **`guide="y"`** snaps to a horizontal guide instead of the default vertical
  one.

A few rules the engine keeps:

- Real content is always in the DOM. While a part of the page waits to be built
  it is only `opacity: 0` with `pointer-events: none`, so the layout never
  moves.
- Layout is read only in measure passes (after fonts and the photo load, and on
  resize). Never inside the frame loop.
- Cursors move by writing `translate3d` straight to the DOM. React re-renders
  only the toolbar, at most ten times a second.
- If you tab into a part of the page that isn't built yet, it is built
  immediately.

## Controls

| Control | Does |
| --- | --- |
| 1× / 2× / 3× | Build speed (one button that cycles on phones) |
| Tour | Auto-scrolls with the build. On by default; scrolling yourself turns it off |
| Skip | Finishes the page at once, cursors and design chrome still showing |
| × or <kbd>Esc</kbd> | Straight to the live site |
| Go live | Fades out the cursors, guides and toolbar |
| Replay, Rebuild or <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd> | Builds the page again from the top |

When the build finishes on its own, the page glides back to the top after a
short pause, unless the visitor has started scrolling.

Visitors who prefer reduced motion get the finished page with a Rebuild button,
and the intro never plays on its own.

## Credits

Build animation inspired by Swarm by Joel Califa. The engine is written from
scratch.
