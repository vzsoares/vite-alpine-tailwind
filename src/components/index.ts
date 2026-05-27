import { PageAbout } from "../pages/about";
import { PageBlog } from "../pages/blog";
import { PageHome } from "../pages/home";
import { PageNotFound } from "../pages/not-found";
import { PagePost } from "../pages/post";
import { AppFooter } from "./app-footer";
import { AppNav } from "./app-nav";
import { CounterCard } from "./counter-card";
import { ThemeToggle } from "./theme-toggle";

const REGISTRY: [string, CustomElementConstructor][] = [
    ["app-nav", AppNav],
    ["app-footer", AppFooter],
    ["theme-toggle", ThemeToggle],
    ["counter-card", CounterCard],
    ["page-home", PageHome],
    ["page-about", PageAbout],
    ["page-blog", PageBlog],
    ["page-post", PagePost],
    ["page-not-found", PageNotFound],
];

/**
 * Define every custom element. Call before `Alpine.start()` so Alpine's initial
 * DOM walk sees the components' rendered Light-DOM markup. Guarded so it is safe
 * to call more than once (e.g. under HMR).
 */
export function registerComponents(): void {
    for (const [name, ctor] of REGISTRY) {
        if (!customElements.get(name)) customElements.define(name, ctor);
    }
}
