import type { Droppable } from "$lib/dnd/core/types";
import type { Attachment } from "svelte/attachments";
import type { DndManager } from "$lib/dnd/core/DndManager";

interface Props extends Omit<Droppable, "element"> {
    manager: DndManager;
}

export const droppable = ({
    manager,
    id,
    data,
    disabled = false,
}: Props): Attachment => {
    return (node: Element) => {
        if (!(node instanceof HTMLElement)) return;

        manager.registerDroppable({ id, data, disabled, element: node });
        return () => {
            manager.unregisterDroppable(id);
        }
    }
}