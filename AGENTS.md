# AGENTS.md

Guidance for AI coding agents working in this repo. Humans: see `README.md`.

## What this is

A **lightweight client-side SPA** built on Vite + Alpine.js + Tailwind. The UI is
authored as **native Web Components (custom elements, Light DOM)**, made reactive
with Alpine, and routed in the browser with **pinecone-router**. Nothing is
prerendered — the server ships one `index.html` shell. See `DESIGN.md` for the
visual system and `docs/web-components.md` for the component pattern.

> The prerendered/SSG sibling is **vite-alpine-tailwind-x** (JSX + static HTML +
> blog/search/SEO). Don't bring that architecture here — this repo is deliberately
> pure client-side.

## Always verify before delivering

Run the full suite and fix anything red **before** presenting a change:

```bash
bun run check       # Biome lint + format (writes)
bun run typecheck   # tsc --noEmit
bun run test        # Vitest unit tests
bun run build       # Vite build (emits dist/ + 404.html)
bun run test:e2e    # Playwright: dev + production-build suites (first time: bunx playwright install chromium)
```

`test:e2e` runs two projects from one `playwright.config.ts`: `dev` (`e2e/` vs.
the dev server) and `preview` (`e2e-preview/` vs. the production build under the
Pages base path — this catches base-path and 404.html SPA-fallback regressions,
and is what CI gates on). Run a single suite with `playwright test
--project=dev|preview`.

For UI changes, also **look at the result** (`bun run dev`, or a Playwright
screenshot) — several layout/timing bugs are only visible visually.

## How the repo works

- **Components are elements.** Reusable UI lives in `src/components/` as classes
  extending `LightElement` (`src/components/base.ts`), which renders an HTML string
  into the element's own children **once** in `connectedCallback`. Register every
  element in `src/components/index.ts`.
- **Pages are elements too.** One `<page-*>` element per route in `src/pages/`.
- **Routes are a table.** `index.html` maps each route to a page element via
  pinecone `<template x-route="…" x-template.target.app>`. **Add a route = add a
  `src/pages/<name>.ts`, register it, add a `<template x-route>` row.**
- **Reactive logic is data factories.** `Alpine.data()` factories live in
  `src/alpine.ts` (`counter`, `blogPost`) — plain, DOM-free, unit-tested.
- **`src/config.ts` is the single source of truth** for identity, base path, and
  links — imported by both the build and the components.

## Tools

Bun (pm + runner) · Biome (lint/format) · Vitest (unit) · Playwright (e2e) ·
release-it (releases). Vite 8 is Rolldown/**oxc**-based. Runtime libs: `alpinejs`,
`pinecone-router`, `tailwindcss`/`daisyui`.

## Gotchas (learned the hard way)

- **Light DOM only — never `attachShadow`.** Shadow roots hide `x-*` directives
  from Alpine's DOM walk *and* block the global Tailwind/daisyUI stylesheet. All
  components render into `this.innerHTML`.
- **Render once; never `Alpine.initTree()` yourself.** Alpine's initial walk (for
  elements present before `Alpine.start()`) or its MutationObserver (for elements
  the router inserts) initializes inner `x-data` exactly once. Re-initializing
  double-binds handlers. `LightElement` guards against double-render.
- **In plain HTML strings, use the natural Alpine shorthands** — `@click`,
  `:class`, `x-text`. (The `x-on:`/`x-bind:` longhand was only needed in the JSX
  sibling.)
- **pinecone v7: `settings()` is a function, called in `alpine:init`** — NOT
  options passed to `Alpine.plugin()`. Keys: `basePath`, `targetID` (capital ID),
  `hash`, `handleClicks`, `pushState`. See `src/app.ts`.
- **basePath must NOT have a trailing slash** (`import.meta.env.BASE_URL` does) or
  routes double up. We strip it: `.replace(/\/$/, "")`.
- **Same-route param changes don't re-render the template.** For `/blog/:slug`
  prev/next navigation, read the param with `x-effect="load($params.slug)"`, not
  once in `init()` (it would go stale). See `<page-post>` + `blogPost()`.
- **The `notfound` route ships a default handler that `console.error`s.** We
  override it with `x-handler="[]"` on the notfound template so the console stays
  clean (the 404 UI still renders).
- **GitHub Pages needs a `404.html` SPA fallback.** The build copies
  `dist/index.html` → `dist/404.html` (see the `gh-pages-spa-fallback` plugin in
  `vite.config.ts`) so deep links / refreshes boot the app. Hash mode
  (`hash: true`) is the escape hatch if you can't emit the 404 copy.
- **`base` lives in `src/config.ts` (`BASE`)**, applied for build + preview only
  (dev stays `/`). It drives both Vite's `base` and the router `basePath`.
- **`vite.config.ts` isn't type-checked** by `tsc` (outside `include: ["src"]`),
  but Biome **does** lint it.

## Conventions

- Avoid `as` / `any` — narrow with typed `this` params / type guards.
- Match existing style; Biome formats (4-space indent, double quotes).
- Commit directly to `main` (no feature branch). Release with
  `GITHUB_TOKEN="$(gh auth token)" bunx release-it <minor|patch> --ci`.
- Keep `README.md` and `DESIGN.md` in sync when behavior/visuals change.
