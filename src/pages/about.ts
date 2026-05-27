import { LightElement } from "../components/base";

const STACK = [
    "Vite for the dev server and optimized builds",
    "Alpine.js for client-side reactivity",
    "Tailwind CSS v4 (+ daisyUI) for styling",
    "Native Web Components for the UI, routed with pinecone-router",
];

/** `<page-about>` — second route; demonstrates an Alpine accordion that hydrates
 *  after client-side navigation. */
export class PageAbout extends LightElement {
    protected render(): string {
        const stack = STACK.map((item) => `<li>${item}</li>`).join("");
        return /* html */ `
        <div class="flex-1 px-8 py-16">
            <div class="mx-auto max-w-2xl">
                <h1 class="mb-6 bg-gradient-to-r from-brand-1 to-brand-2 bg-clip-text text-4xl font-bold text-transparent">About this template</h1>
                <p class="mb-6 opacity-80">
                    A lightweight, fully client-side SPA. The UI is authored as native
                    Web Components (Light DOM, so Tailwind + Alpine work normally), and
                    pinecone-router resolves routes in the browser — no build-time
                    prerendering and no UI framework runtime beyond Alpine.
                </p>

                <h2 class="mb-4 text-2xl font-semibold">The stack</h2>
                <ul class="mb-10 list-inside list-disc space-y-2 opacity-80">${stack}</ul>

                <h2 class="mb-4 text-2xl font-semibold">FAQ</h2>
                <div x-data="{ open: false }" class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        data-testid="faq-toggle"
                        @click="open = !open"
                        class="flex w-full items-center justify-between px-5 py-4 text-left font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    >
                        Does Alpine still work after navigating here?
                        <span x-text="open ? '−' : '+'">+</span>
                    </button>
                    <p x-show="open" x-cloak data-testid="faq-answer" class="px-5 pb-4 opacity-80">
                        Yes — pinecone-router swaps the route's Web Component into the page,
                        and Alpine's MutationObserver initializes the new markup, so
                        directives like this accordion are interactive on every route.
                    </p>
                </div>
            </div>
        </div>`;
    }
}
