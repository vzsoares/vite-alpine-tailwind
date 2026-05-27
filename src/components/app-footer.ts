import { LINKS, SITE } from "../config";
import { LightElement } from "./base";

/**
 * `<app-footer>` — persistent footer. The version string is injected at build
 * time from package.json via Vite's `define` (`__APP_VERSION__`).
 */
export class AppFooter extends LightElement {
    protected render(): string {
        const links = LINKS.map(
            (link) => `
                <a href="${link.href}" target="_blank" rel="noopener" native class="link link-hover opacity-70 hover:opacity-100">${link.label}</a>`,
        ).join("");

        return /* html */ `
        <footer class="mt-auto border-t border-gray-200 px-8 py-8 dark:border-gray-800">
            <div class="mx-auto flex max-w-6xl flex-col items-center justify-between md:flex-row">
                <div class="mb-4 md:mb-0">
                    <span class="opacity-70">Created by </span>
                    <a href="${SITE.authorUrl}" target="_blank" rel="noopener" native class="link link-hover font-medium">${SITE.author}</a>
                </div>
                <div class="flex items-center space-x-4">${links}</div>
            </div>
            <div class="mx-auto mt-6 max-w-6xl text-center text-sm opacity-60">
                <span data-testid="app-version">v${__APP_VERSION__}</span>
            </div>
        </footer>`;
    }
}
