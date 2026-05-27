import { LightElement } from "../components/base";
import { posts } from "../content/posts";

/** `<page-blog>` — blog index. Maps the static `posts` data to cards linking to
 *  each `/blog/:slug` route (client-side navigation via pinecone-router). */
export class PageBlog extends LightElement {
    protected render(): string {
        const items = posts
            .map(
                (post) => `
                <li>
                    <a href="/blog/${post.slug}" class="card border border-base-300 bg-base-100 transition-shadow hover:shadow-lg">
                        <div class="card-body">
                            <h2 class="card-title transition-colors hover:text-brand-1">${post.title}</h2>
                            <p class="text-sm opacity-60">${post.date}</p>
                            <p class="opacity-80">${post.excerpt}</p>
                        </div>
                    </a>
                </li>`,
            )
            .join("");

        return /* html */ `
        <div class="flex-1 px-8 py-16">
            <div class="mx-auto max-w-2xl">
                <h1 class="mb-3 bg-gradient-to-r from-brand-1 to-brand-2 bg-clip-text text-4xl font-bold text-transparent">Blog</h1>
                <p class="mb-10 opacity-80">Lorem ipsum posts — each renders client-side from static data.</p>
                <ul class="space-y-6">${items}</ul>
            </div>
        </div>`;
    }
}
