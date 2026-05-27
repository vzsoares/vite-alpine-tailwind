/**
 * Base class for this template's Web Components.
 *
 * Renders an HTML string into the element's **own children (Light DOM)** — not a
 * Shadow DOM — exactly once. Light DOM is deliberate: it lets the global Tailwind
 * + daisyUI stylesheet apply, and lets Alpine discover the `x-*` directives inside
 * (Alpine's DOM walk and MutationObserver do not cross shadow boundaries).
 *
 * Do NOT call `Alpine.initTree()` on the rendered markup: Alpine's initial walk
 * (for elements present before `Alpine.start()`) or its MutationObserver (for
 * elements the router inserts later) initializes inner `x-data` exactly once.
 * Re-initializing would double-bind handlers.
 */
export abstract class LightElement extends HTMLElement {
    #rendered = false;

    connectedCallback(): void {
        if (this.#rendered) return;
        this.#rendered = true;
        this.innerHTML = this.render();
    }

    protected abstract render(): string;
}

/** Resolve a `public/` asset against the configured base path (works in dev + build). */
export function asset(path: string): string {
    return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
