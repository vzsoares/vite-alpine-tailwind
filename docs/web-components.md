# Web Components + Alpine + pinecone-router

How the UI is built here, why it's built this way, and how to extend it.

## The model

The UI is **native custom elements** that render into their **own children
(Light DOM)**. Alpine provides reactivity; pinecone-router swaps page elements in
and out per route. There is no virtual DOM and no framework runtime beyond Alpine.

```
index.html (shell)
 └─ <body x-data="{ darkMode }">          ← dark-mode state, shared scope
     ├─ <app-nav>      (persistent chrome, rendered once)
     ├─ <main id="app">   ← router renders the matched <page-*> here
     ├─ <app-footer>   (persistent chrome)
     └─ <template x-route="…">  ← the route table
```

## Why Light DOM (not Shadow DOM)

Shadow DOM is intentionally **not** used. Two hard reasons:

1. **Tailwind/daisyUI is a global stylesheet.** Its selectors do not cross shadow
   boundaries, so `btn`, `card`, `prose`, etc. would not apply inside a shadow root.
2. **Alpine doesn't walk shadow roots.** Alpine's DOM walk and MutationObserver
   stop at shadow boundaries, so `x-*` directives inside a shadow root are invisible.

Rendering into `this.innerHTML` (Light DOM) keeps both working. **Never call
`attachShadow()` in this project.**

## The base class

All components extend `LightElement` (`src/components/base.ts`):

```ts
export abstract class LightElement extends HTMLElement {
    #rendered = false;
    connectedCallback(): void {
        if (this.#rendered) return; // render exactly once
        this.#rendered = true;
        this.innerHTML = this.render();
    }
    protected abstract render(): string;
}
```

In the returned HTML string, use Alpine's natural shorthands: `@click`, `:class`,
`x-text`, `x-show`, `x-html`.

## How Alpine initializes the markup

You do **not** call `Alpine.initTree()` yourself. Alpine initializes a component's
inner `x-data` exactly once, via one of two paths:

- **Present before `Alpine.start()`** (e.g. `<app-nav>` in the shell): Alpine's
  initial DOM walk sees the already-rendered Light-DOM content.
- **Inserted later** (e.g. the router swaps `<page-home>` into `#app`): Alpine's
  **MutationObserver** picks up the inserted subtree and initializes it.

That's why `registerComponents()` runs **before** `Alpine.start()` in
`src/app.ts` (so the initial walk sees the chrome), and why double-rendering or a
manual `initTree` is forbidden — it would double-bind handlers (e.g. a counter
that increments twice per click).

## Reactive logic lives in Alpine.data factories

Keep behavior out of the element and in a typed `Alpine.data()` factory
(`src/alpine.ts`) so it's plain, DOM-free, and unit-testable:

```ts
export function counter(start = 0): CounterState {
    return { count: start, increment() { this.count++ }, /* … */ };
}
```

The element just renders the markup that references it:

```ts
this.innerHTML = `<div x-data="counter(${start})"><p x-text="count"></p>…</div>`;
```

## Reading route params

`/blog/:slug` exposes the param via the `$params` magic. **Important:**
pinecone does *not* re-render a route's template when only the param changes
(e.g. prev → next post on the same `/blog/:slug` route). So don't read the slug
once in `init()` — drive it with `x-effect`, which re-runs when `$params` changes:

```html
<article x-data="blogPost" x-effect="load($params.slug)">…</article>
```

```ts
export function blogPost() {
    return { post: undefined, load(slug) { this.post = getPost(slug); /* … */ } };
}
```

## Recipes

### Add a reusable component

1. `src/components/my-thing.ts` — `export class MyThing extends LightElement { … }`.
2. Register it in `src/components/index.ts` (`["my-thing", MyThing]`).
3. Use `<my-thing></my-thing>` anywhere (shell, a page, or another component).

### Add a route / page

1. `src/pages/contact.ts` — `export class PageContact extends LightElement { … }`.
2. Register `["page-contact", PageContact]` in `src/components/index.ts`.
3. Add a row to the route table in `index.html`:
   ```html
   <template x-route="/contact" x-template.target.app><page-contact></page-contact></template>
   ```
4. Link to it with `<a href="/contact">` (pinecone intercepts + prepends basePath).

### Opt a link out of the router

External / download links get a `native` attribute so the browser handles them:

```html
<a href="https://example.com" target="_blank" rel="noopener" native>External</a>
```

## Gotchas recap

- Light DOM only — no `attachShadow`.
- Render once; never `Alpine.initTree()` a router-inserted subtree.
- `settings()` is a function called in `alpine:init` (pinecone v7), not options to
  `Alpine.plugin()`. `basePath` must have no trailing slash.
- Same-route param changes need `x-effect` / `$watch`, not a one-shot `init()`.
- The `notfound` route's default handler `console.error`s — overridden with
  `x-handler="[]"` in `index.html`.
