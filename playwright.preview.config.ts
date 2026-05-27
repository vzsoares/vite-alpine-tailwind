import { defineConfig, devices } from "@playwright/test";

// E2E against the PRODUCTION build served by `vite preview` (under the GitHub
// Pages base path). This catches build/base regressions the dev e2e can't see —
// base-prefixed assets and, crucially, the 404.html SPA deep-link fallback.
// Separate port (5274) from the dev e2e (5273).
const PORT = 5274;
const BASE = "/vite-alpine-tailwind/";
const baseURL = `http://localhost:${PORT}${BASE}`;

export default defineConfig({
    testDir: "./e2e-preview",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
    use: { baseURL, trace: "on-first-retry" },
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
    webServer: {
        command: `bun run build && bun run preview --port ${PORT} --strictPort`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
    },
});
