import type { Attachment } from "svelte/attachments";
import type { ClickOutsideStore } from "../contexts/clickOutsideContext.svelte";

interface Props {
    store: ClickOutsideStore,
}

export const ignoreclickoutside = ({
    store
}: Props): Attachment => (node: Element) => {
    if (!(node instanceof HTMLElement)) return;

    store.register(node);
    return () => {
        store.unregister(node);
    }
}