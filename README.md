<p align="center">
  <img src="./public/og.png" alt="Vite + Alpine + Tailwind" width="640" />
</p>

# ⚡ Vite + 🗻 Alpine + 🎨 Tailwind — Template

![Stack](https://img.shields.io/badge/stack-Vite%20%7C%20Alpine.js%20%7C%20Tailwind%20CSS-blue)
![License](https://img.shields.io/badge/license-MIT-green)

🔗 **[Live demo](https://vzsoares.github.io/vite-alpine-tailwind/)**

A **lightweight client-side SPA** starter: it authors its UI as **native Web
Components** 🧩, wires reactivity with **Alpine.js** 🗻, styles with **Tailwind
CSS v4** 🎨, and routes entirely in the browser with **pinecone-router** 🧭 —
shipping a tiny bundle and deploying free to **GitHub Pages**. 🚀

> Looking for the batteries-included, **prerendered** sibling (type-safe JSX →
> static HTML, Markdown blog, full-text search, SEO/social cards)? That's
> **[vite-alpine-tailwind-x](https://github.com/vzsoares/vite-alpine-tailwind-x)**.
> This repo is the lean, pure client-side counterpart.

## ✨ Features

**Stack**

- ⚡️ **Vite** — lightning-fast dev server and builds (Rolldown / oxc)
- 🗻 **Alpine.js** — the reactivity behind every component
- 🧩 **Web Components** — UI authored as native custom elements (Light DOM)
- 🧭 **pinecone-router** — client-side routing (history mode) for Alpine
- 🎨 **Tailwind CSS v4** — utility-first styling (+ `typography` prose + **daisyUI**)
- 📦 **TypeScript** · 🍞 **Bun** · 🧹 **Biome** · 🧪 **Vitest** · 🎭 **Playwright**

**What you get**

- 🧩 **Web-Component authoring** — `<app-nav>`, `<app-footer>`, `<theme-toggle>`,
  `<counter-card>`, plus one `<page-*>` element per route
- 🧭 **SPA routing** — `/`, `/about`, `/blog`, `/blog/:slug`, and a `notfound` route
- 📝 **Static blog** — posts as data, rendered client-side (index + per-post pages)
- 🌙 **Dark mode** — `data-theme` + `.dark`, remembers your choice
- ♿ **Accessible** — landmarks, visible focus rings, `aria-*`
- 🛰️ **GitHub Pages ready** — base path wired + `404.html` SPA deep-link fallback
- 🛡️ **Hardened CI** — lint/type/unit + e2e (dev **and** production build),
  Dependabot, CodeQL & gitleaks, auto-deploy to GitHub Pages

## 🏁 Quick Start

```bash
# Use this template, then:
bun install
bun run dev        # 👉 http://localhost:5173

bun run build      # build SPA into dist/ (+ 404.html fallback)
bun run preview    # preview the production build
```

> First time running e2e tests? Install the browser once:
> `bunx playwright install chromium`

## 📜 Scripts

| Command                    | Description                                   |
| -------------------------- | --------------------------------------------- |
| `bun run dev`              | Start the Vite dev server with HMR            |
| `bun run build`            | Build into `dist/` (emits a `404.html` copy)  |
| `bun run preview`          | Preview the production build locally          |
| `bun run check`            | Lint **and** format the codebase (Biome)      |
| `bun run lint`             | Lint without writing changes (Biome)          |
| `bun run format`           | Format files in place (Biome)                 |
| `bun run typecheck`        | Type-check with `tsc --noEmit`                |
| `bun run test`             | Run unit tests once (Vitest)                  |
| `bun run test:watch`       | Run unit tests in watch mode (Vitest)         |
| `bun run test:e2e`         | E2E browser tests — dev **and** production-build suites (Playwright) |

## 🗂️ Project Structure

```
/
├── public/         # Static assets copied as-is (favicon.ico, og.png, logos/)
├── index.html      # SPA shell: <body> dark-mode state, #app target, route table
├── src/
│   ├── app.ts      # Bootstrap: define elements → Alpine.plugin → data → settings → start
│   ├── alpine.ts   # Typed Alpine.data() factories: counter(), blogPost()
│   ├── config.ts   # Site identity, base path, nav + footer links
│   ├── globals.d.ts# Ambient types (__APP_VERSION__, window.Alpine/PineconeRouter)
│   ├── styles.css  # Tailwind + typography + daisyUI + brand tokens + dark + x-cloak
│   ├── content/posts.ts # Blog content (HTML strings) + getPost()
│   ├── components/ # Reusable Web Components
│   │   ├── base.ts        # LightElement (render-once, Light DOM) + asset()
│   │   ├── index.ts       # registerComponents() — customElements.define(...)
│   │   └── app-nav.ts · app-footer.ts · theme-toggle.ts · counter-card.ts
│   └── pages/      # One Web Component per route (<page-home>, …)
│       └── home.ts · about.ts · blog.ts · post.ts · not-found.ts
├── e2e/            # Playwright e2e (vs. dev): routing, counter, dark-mode, blog…
├── e2e-preview/    # E2E vs. the production build (base path, 404.html fallback)
├── vite.config.ts  # base by command/isPreview, Tailwind, SPA 404 plugin, Vitest
└── docs/web-components.md  # The Web-Component + Alpine + router pattern & gotchas
```

## 🧩 Web Components

The UI is authored as **native custom elements** that render into their **own
children (Light DOM)** — see `src/components/base.ts` (`LightElement`). Light DOM
is deliberate: it lets the global Tailwind/daisyUI stylesheet apply, and lets
Alpine discover the `x-*` directives inside (Alpine does not cross Shadow DOM).

```ts
// src/components/counter-card.ts
export class CounterCard extends LightElement {
    protected render(): string {
        const start = Number(this.getAttribute("start") ?? 0) || 0;
        return `<div x-data="counter(${start})">
            <p x-text="count"></p>
            <button @click="increment()">+</button>
        </div>`;
    }
}
```

Register new elements in `src/components/index.ts`. Reactive logic lives in typed
`Alpine.data()` factories (`src/alpine.ts`) so it stays unit-testable. See
[docs/web-components.md](docs/web-components.md) for the full pattern + gotchas.

## 🧭 Routing

Routing is **client-side**, declared in `index.html` as a table of
[pinecone-router](https://pinecone-router.github.io/router/) `<template x-route>`
elements that render a page component into `<main id="app">`:

```html
<template x-route="/about" x-template.target.app><page-about></page-about></template>
<template x-route="/blog/:slug" x-template.target.app><page-post></page-post></template>
```

- **Add a route** with two edits: create `src/pages/<name>.ts` (a `<page-*>`
  element), register it in `components/index.ts`, and add a `<template x-route>`.
- Navigation is plain `<a href="/about">` — pinecone intercepts clicks and
  prepends the configured `basePath`. Add `native` to opt a link out (externals).
- **Dynamic params** (`/blog/:slug`) are read via the `$params` magic. Because
  pinecone does not re-render the template when only the param changes (e.g.
  prev/next post), `<page-post>` uses `x-effect="load($params.slug)"` to re-resolve.

## 🌙 Dark mode & 🎨 UI (daisyUI)

Dark mode is Alpine state on `<body>` (persisted to `localStorage`), toggled by
`<theme-toggle>`; daisyUI themes follow via `data-theme`. Rebrand the whole site
by editing the three `brand-*` tokens in `src/styles.css`. See [DESIGN.md](DESIGN.md).

## 🚀 Deploy

Pushing to `main` runs the checks and deploys `dist/` to **GitHub Pages** via
`.github/workflows/deploy.yml`. Because routing is client-side, the build emits a
`404.html` (a copy of `index.html`) so deep links / refreshes resolve — GitHub
Pages serves it for unknown paths and the router takes over. Deploying elsewhere?
Update `BASE` in `src/config.ts` (it sets Vite's `base` and the router `basePath`).

## 📚 Docs

- 🧩 **[docs/web-components.md](docs/web-components.md)** — the component + router pattern
- 🎨 **[DESIGN.md](DESIGN.md)** — design tokens & visual system
- 🤖 **[AGENTS.md](AGENTS.md)** — guide for AI coding agents (verify, tools, gotchas)

## 📄 License

[MIT License](LICENSE)

---

Created by [vzsoares](https://github.com/vzsoares) 💜
