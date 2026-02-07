import type { Attachment } from "svelte/attachments";
import type { Draggable } from "../../core/types";
import type { DndManager } from "$lib/dnd/core/DndManager";

interface Props extends Omit<Draggable, "element"> {
    manager: DndManager;
}

export const draggable = ({
    manager,
    id,
    data,
    disabled = false,
}: Props): Attachment => (node: Element) => {
    if (!(node instanceof HTMLElement)) return;

    manager.registerDraggable({ id, data, disabled, element: node });

    const rawListeners = manager.createListeners(id);
    const listeners: [string, EventListener][] = [];
    Object.entries(rawListeners).forEach(([eventName, handler]) => {
        node.addEventListener(eventName, handler);
        listeners.push([eventName, handler]);
    });

    return () => {
        listeners.forEach(([eventName, handler]) => {
            node.removeEventListener(eventName, handler);
        });

        manager.unregisterDraggable(id);
    };
}
