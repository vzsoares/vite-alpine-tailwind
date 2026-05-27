import { NAV, SITE } from "../config";
import { LightElement } from "./base";

/** Alpine expression that is truthy when nav item `key` matches the live route. */
function activeWhen(key: string): string {
    if (key === "blog") return "path.startsWith('/blog')";
    if (key === "home") return "path === '/'";
    return `path === '/${key}'`;
}

/**
 * `<app-nav>` — persistent top navigation (rendered once, never re-routed).
 * Brand wordmark, internal links (intercepted by pinecone-router), a GitHub link,
 * and the `<theme-toggle>`. Active-link highlighting tracks `$router.context.path`,
 * refreshed on every `pinecone:end` navigation event.
 */
export class AppNav extends LightElement {
    protected render(): string {
        const links = NAV.map(
            (item) => `
                <a
                    href="${item.href}"
                    :class="${activeWhen(item.key)} ? 'text-brand-1 font-semibold' : 'hover:text-brand-1 transition-colors'"
                >${item.label}</a>`,
        ).join("");

        return /* html */ `
        <nav
            x-data="{ path: '' }"
            x-init="path = $router.context?.path ?? '';
                    document.addEventListener('pinecone:end', () => path = $router.context.path)"
            class="flex items-center justify-between px-8 py-6"
        >
            <a href="/" class="flex items-center">
                <span class="bg-gradient-to-r from-brand-1 to-brand-2 bg-clip-text text-2xl font-bold text-transparent">VAT</span>
                <span class="ml-2 text-lg opacity-80">Template</span>
            </a>

            <div class="hidden items-center space-x-8 md:flex">
                ${links}
                <a href="${SITE.repoUrl}" target="_blank" rel="noopener" native class="transition-colors hover:text-gray-500">GitHub</a>
            </div>

            <theme-toggle></theme-toggle>
        </nav>`;
    }
}
