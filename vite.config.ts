/// <reference types="vitest/config" />
import { copyFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import { BASE } from "./src/config";

const { version } = JSON.parse(
    readFileSync(resolve(process.cwd(), "package.json"), "utf-8"),
);

/**
 * GitHub Pages serves `404.html` for any path it can't resolve to a file. For a
 * client-routed SPA, that means deep links and refreshes on routes like
 * `/blog/<slug>/` would 404 without a fallback. Copying the built `index.html`
 * to `404.html` makes every unknown path boot the same app shell; pinecone-router
 * then resolves the real route from `location.pathname`. Simpler and flash-free
 * compared to the redirect-script hack.
 */
function ghPagesSpaFallback(): Plugin {
    let outDir = "dist";
    return {
        name: "gh-pages-spa-fallback",
        apply: "build",
        configResolved(config) {
            outDir = config.build.outDir;
        },
        closeBundle() {
            const dir = resolve(process.cwd(), outDir);
            copyFileSync(resolve(dir, "index.html"), resolve(dir, "404.html"));
        },
    };
}

export default defineConfig(({ command, isPreview }) => ({
    // Build + preview run under the GitHub Pages project subpath; dev stays at
    // root for convenience. `import.meta.env.BASE_URL` follows this value, and
    // the router derives its basePath from it (see src/app.ts).
    base: command === "build" || isPreview ? BASE : "/",
    // SPA history-API fallback: serve index.html for unknown paths so client
    // routes (e.g. /about) resolve on a hard load / refresh in dev too.
    appType: "spa",
    plugins: [tailwindcss(), ghPagesSpaFallback()],
    define: {
        // App version, surfaced in the footer (see <app-footer>).
        __APP_VERSION__: JSON.stringify(version),
    },
    test: {
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
}));
