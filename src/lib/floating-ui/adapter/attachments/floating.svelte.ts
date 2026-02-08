import { autoUpdate, computePosition, type ComputePositionConfig, type Placement } from "@floating-ui/dom";
import type { Attachment } from "svelte/attachments";

interface Props {
    referenceElement: HTMLElement;
    isVisible: boolean;
    arrowElement?: HTMLElement;
    options: Partial<ComputePositionConfig>;
    onClick?: (e: MouseEvent) => void;
    onMouseOver?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
}

type Side = Extract<Placement, "top" | "right" | "bottom" | "left">;

export const floating = ({
    referenceElement,
    arrowElement,
    isVisible,
    options = {},
    onClick,
    onMouseOver,
    onMouseLeave
}: Props): Attachment => (node: Element) => {
    if (!(node instanceof HTMLElement)) return;
    node.style.display = isVisible ? '' : 'none';

    const cleanup = autoUpdate(referenceElement, node, async () => {
        const { x, y, strategy: position, placement, middlewareData } = await computePosition(referenceElement, node, {
            strategy: options.strategy ?? "absolute",
            placement: options.placement ?? "right",
            middleware: options.middleware ?? []
        });
        Object.assign(node.style, {
            left: `${x}px`,
            top: `${y}px`,
            position,
        });

        if (arrowElement && middlewareData.arrow) {
            const { x: arrowX, y: arrowY } = middlewareData.arrow;
            const side = placement.split('-')[0] as Side;
            const staticSide: Record<Side, Side> = {
                top: 'bottom',
                right: 'left',
                bottom: 'top',
                left: 'right',
            };

            Object.assign(arrowElement.style, {
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
                right: '',
                bottom: '',
                [staticSide[side]]: '-4px',
            });
        }
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
