/**
 * Path the site is served under (its GitHub Pages project subpath). Shared by
 * the build (`vite.config.ts` sets Vite's `base`) and the router (`src/app.ts`
 * derives pinecone's `basePath` from `import.meta.env.BASE_URL`). Keep free of
 * browser/Node-only APIs so both can import it.
 */
export const BASE = "/vite-alpine-tailwind/";

/** Canonical public URL (used for OG/social meta tags). Must end with `/`. */
export const SITE_URL = "https://vzsoares.github.io/vite-alpine-tailwind/";

/** GitHub repository URL (used for nav/footer links). */
export const REPO_URL = "https://github.com/vzsoares/vite-alpine-tailwind";

/** GitHub username (used for the footer author link). */
export const AUTHOR = "vzsoares";
