import Alpine from "alpinejs";
import PineconeRouter from "pinecone-router";
import { blogPost, counter } from "./alpine";
import { registerComponents } from "./components";

// 1. Define the custom elements before Alpine starts, so Alpine's initial DOM
//    walk sees their rendered Light-DOM content (persistent chrome especially).
registerComponents();

// 2. Register the router plugin + typed Alpine.data components — all must run
//    before Alpine.start(). NOTE: pinecone-router v7 takes NO options here;
//    settings() is a separate function called in `alpine:init` below.
Alpine.plugin(PineconeRouter);
Alpine.data("counter", counter);
Alpine.data("blogPost", blogPost);

document.addEventListener("alpine:init", () => {
    window.PineconeRouter.settings({
        // Vite injects the deploy subpath as BASE_URL ("/" in dev). pinecone's
        // basePath must NOT keep the trailing slash, or routes double up.
        basePath: import.meta.env.BASE_URL.replace(/\/$/, ""),
        // Render matched routes into <main id="app"> (matches `.target.app`).
        targetID: "app",
        // History mode (clean URLs); the build emits a 404.html SPA fallback.
        hash: false,
    });
});

// Expose for devtools / debugging.
window.Alpine = Alpine;

// 3. Start — walks the DOM, registers magics ($router/$params), attaches the
//    MutationObserver (which inits router-inserted page components), then the
//    router performs its first navigation.
Alpine.start();
