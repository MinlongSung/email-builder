import type { Attachment } from "svelte/attachments";
import type { ClickOutsideStore } from "../contexts/clickOutsideContext.svelte";

interface Props {
    store: ClickOutsideStore,
    onClick: (e: MouseEvent) => void;
}

export const clickoutside = ({
    store,
    onClick,
}: Props): Attachment => (node: Element) => {
    if (!(node instanceof HTMLElement)) return;

    const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (store.shouldDismiss(target)) return;
        onClick?.(e);
    };

    document.addEventListener("click", handleClick);
    return () => {
        document.removeEventListener("click", handleClick);
    }
}