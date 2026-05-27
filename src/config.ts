/**
 * Central site configuration, shared by the build (`vite.config.ts`) and the UI
 * components. Keep this free of browser/Node-only APIs so both can import it.
 */

/** Path the site is served under (its GitHub Pages project subpath). */
export const BASE = "/vite-alpine-tailwind/";

/** Absolute origin for canonical / social URLs. Update on deploy. */
export const SITE_URL = `https://vzsoares.github.io${BASE}`;

/** Site identity, used across `<head>` metadata and the UI. */
export const SITE = {
    name: "Vite Alpine Tailwind",
    headline: "Vite + Alpine + Tailwind",
    description:
        "A lightweight client-side SPA starter combining Vite, Alpine.js and Tailwind CSS — UI as Web Components, routed with pinecone-router.",
    keywords: "vite, alpine.js, tailwind css, web components, spa, template",
    author: "vzsoares",
    authorUrl: "https://github.com/vzsoares",
    repoUrl: "https://github.com/vzsoares/vite-alpine-tailwind",
};

/** Internal nav links. Authored without the base — pinecone-router prepends
 *  the configured basePath, and `<a href>` clicks are intercepted client-side. */
export const NAV = [
    { href: "/", label: "Home", key: "home" },
    { href: "/blog", label: "Blog", key: "blog" },
    { href: "/about", label: "About", key: "about" },
] as const;

/** External links shown in the footer. */
export const LINKS = [
    { href: "https://vitejs.dev", label: "Vite" },
    { href: "https://alpinejs.dev", label: "Alpine.js" },
    { href: "https://tailwindcss.com", label: "Tailwind" },
    { href: "https://pinecone-router.github.io/router/", label: "Pinecone" },
    { href: SITE.repoUrl, label: "GitHub" },
];
