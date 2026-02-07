import type { Scrollable } from "$lib/dnd/core/types";
import type { Attachment } from "svelte/attachments";
import type { DndManager } from "$lib/dnd/core/DndManager";

interface Props extends Omit<Scrollable, "element"> {
    manager: DndManager;
}

export const scrollable = ({
    manager,
    id,
}: Props): Attachment => {
    return (node: Element) => {
        if (!(node instanceof HTMLElement)) return;

        manager.registerScrollable({ id, element: node });
        return () => {
            manager.unregisterScrollable(id);
        }
    }
}