import { getContext, setContext } from "svelte";
import { SvelteSet } from "svelte/reactivity";

export class ClickOutsideStore {
    private _ignoredElements = new SvelteSet<HTMLElement>();

    register(element: HTMLElement) {
        this._ignoredElements.add(element);
    }

    unregister(element: HTMLElement) {
        this._ignoredElements.delete(element);
    }

    shouldDismiss(target: Node): boolean {
        for (const el of this._ignoredElements) {
            if (el.contains(target)) return true;
        }
        return false;
    }

    clear() {
        this._ignoredElements.clear();
    }
}

const CONTEXT_KEY = Symbol("clickOutside");

export function setClickOutsideContext() {
    const clickOutsideStore = new ClickOutsideStore();
    setContext(CONTEXT_KEY, clickOutsideStore);
}

export function getClickOutsideContext() {
    return getContext<ClickOutsideStore>(CONTEXT_KEY);
}