import { LightElement } from "./base";

/**
 * `<counter-card start="0">` — the interactive demo. Renders daisyUI card markup
 * with Alpine directives; the reactive logic is the typed `counter()` factory
 * (`src/alpine.ts`), registered via `Alpine.data` in `src/app.ts`. Alpine wires
 * up the inner `x-data` once this Light-DOM markup is inserted.
 */
export class CounterCard extends LightElement {
    protected render(): string {
        const start = Number(this.getAttribute("start") ?? 0) || 0;
        return /* html */ `
        <div
            x-data="counter(${start})"
            data-testid="demo-card"
            class="card mx-auto max-w-sm border border-base-300 bg-base-100 shadow-sm"
        >
            <div class="card-body items-center text-center">
                <p
                    data-testid="counter-value"
                    x-text="count"
                    class="bg-gradient-to-r from-brand-1 to-brand-2 bg-clip-text text-5xl font-bold text-transparent"
                >${start}</p>
                <div class="card-actions mt-4 justify-center">
                    <button type="button" data-testid="counter-decrement" @click="decrement()" aria-label="Decrement" class="btn btn-outline">−</button>
                    <button type="button" data-testid="counter-reset" @click="reset()" class="btn btn-ghost">Reset</button>
                    <button type="button" data-testid="counter-increment" @click="increment()" aria-label="Increment" class="btn btn-primary">+</button>
                </div>
            </div>
        </div>`;
    }
}
