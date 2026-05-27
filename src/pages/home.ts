import { asset, LightElement } from "../components/base";
import { SITE } from "../config";

const LOGOS = [
    { file: "vite.svg", alt: "Vite logo", class: "h-14 w-14 animate-pulse" },
    { file: "alpine.svg", alt: "Alpine.js logo", class: "h-14 w-14" },
    { file: "tailwind.svg", alt: "Tailwind CSS logo", class: "h-14 w-14" },
];

const FEATURES = [
    {
        icon: "vite.svg",
        title: "Vite",
        description:
            "Lightning-fast dev server and optimized builds with HMR and true ESM support.",
    },
    {
        icon: "alpine.svg",
        title: "Alpine.js",
        description:
            "Minimal framework for client-side interactivity — the reactivity behind every Web Component here.",
    },
    {
        icon: "tailwind.svg",
        title: "Tailwind CSS",
        description:
            "Utility-first styling (+ daisyUI components) applied straight to Light-DOM custom elements.",
    },
];

/** `<page-home>` — hero, feature grid, and the interactive counter demo. */
export class PageHome extends LightElement {
    protected render(): string {
        const logos = LOGOS.map(
            (l, i) =>
                `${i ? '<div class="text-4xl font-light">+</div>' : ""}<img src="${asset(`logos/${l.file}`)}" alt="${l.alt}" class="${l.class}" />`,
        ).join("");

        const features = FEATURES.map(
            (f) => `
            <div class="card border border-base-300 bg-base-100 transition-shadow hover:shadow-lg">
                <div class="card-body">
                    <h3 class="card-title"><img src="${asset(`logos/${f.icon}`)}" alt="${f.title}" class="h-8 w-8" /><span>${f.title}</span></h3>
                    <p class="opacity-80">${f.description}</p>
                </div>
            </div>`,
        ).join("");

        return /* html */ `
        <section class="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
            <div class="absolute inset-0 z-0 overflow-hidden">
                <div class="absolute -inset-[10%] bg-gradient-to-r from-purple-100 via-blue-100 to-teal-100 opacity-50 blur-3xl dark:from-purple-900/30 dark:via-blue-900/30 dark:to-teal-900/30 dark:opacity-30"></div>
            </div>
            <div class="relative z-10 mx-auto max-w-3xl text-center">
                <div class="mb-8 flex items-center justify-center space-x-8">${logos}</div>
                <h1 class="mb-6 bg-gradient-to-r from-brand-1 via-brand-2 to-brand-3 bg-clip-text text-5xl font-bold text-transparent">${SITE.headline}</h1>
                <p class="mx-auto mb-8 max-w-2xl text-xl opacity-80">
                    A lightweight SPA starter: UI authored as native Web Components,
                    routed entirely on the client with pinecone-router.
                </p>
                <div class="flex flex-wrap justify-center gap-4">
                    <a href="/about" class="btn btn-primary">Get Started</a>
                    <a href="${SITE.repoUrl}" target="_blank" rel="noopener" native class="btn btn-outline">View on GitHub</a>
                </div>
            </div>
        </section>

        <section class="px-8 py-16">
            <div class="mx-auto max-w-6xl">
                <h2 class="mb-12 text-center text-3xl font-bold">Features</h2>
                <div class="grid gap-8 md:grid-cols-3">${features}</div>
            </div>
        </section>

        <section class="px-8 py-16">
            <div class="mx-auto max-w-6xl">
                <h2 class="mb-4 text-center text-3xl font-bold">Interactive Demo</h2>
                <p class="mx-auto mb-12 max-w-2xl text-center opacity-80">
                    A typed Alpine component (<code class="font-mono text-brand-1">counter()</code> in
                    <code class="font-mono text-brand-1">alpine.ts</code>) rendered by the
                    <code class="font-mono text-brand-1">&lt;counter-card&gt;</code> Web Component.
                </p>
                <counter-card start="0"></counter-card>
            </div>
        </section>`;
    }
}
