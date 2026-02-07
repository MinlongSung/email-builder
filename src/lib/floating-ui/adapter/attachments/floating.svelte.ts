import { autoUpdate, computePosition, type ComputePositionConfig } from "@floating-ui/dom";
import type { Attachment } from "svelte/attachments";

interface Props {
    referenceElement: HTMLElement;
    isVisible: boolean;
    options: Partial<ComputePositionConfig>;
    onClick?: (e: MouseEvent) => void;
    onMouseOver?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
}

export const floating = ({
    referenceElement,
    isVisible,
    options = {},
    onClick,
    onMouseOver,
    onMouseLeave
}: Props): Attachment => (node: Element) => {
    if (!(node instanceof HTMLElement)) return;
    const { strategy = 'absolute', placement = 'right', middleware = [] } = options
    node.style.display = isVisible ? '' : 'none';

    const cleanup = autoUpdate(referenceElement, node, async () => {
        const { x, y } = await computePosition(referenceElement, node, {
            strategy,
            placement,
            middleware
        });
        Object.assign(node.style, {
            left: `${x}px`,
            top: `${y}px`,
            position: 'absolute',
        });
    });

    const attachEvent = <K extends keyof HTMLElementEventMap>(
        type: K,
        handler: (e: HTMLElementEventMap[K]) => void,
        enabled = true
    ): (() => void) => {
        if (!enabled) return () => { };
        referenceElement.addEventListener(type, handler);
        node.addEventListener(type, handler);
        return () => {
            referenceElement.removeEventListener(type, handler);
            node.removeEventListener(type, handler);
        };
    };

    const cleanupClick = attachEvent("click", e => {
        e.stopPropagation();
        onClick?.(e);
    }, !!onClick);

    const cleanupMouseOver = attachEvent("mouseover", e => {
        e.stopPropagation();
        onMouseOver?.(e);
    }, !!onMouseOver);

    const cleanupMouseLeave = attachEvent("mouseleave", e => {
        onMouseLeave?.(e);
    }, !!onMouseLeave);

    return () => {
        cleanup();
        cleanupClick();
        cleanupMouseOver();
        cleanupMouseLeave();
    };
};
