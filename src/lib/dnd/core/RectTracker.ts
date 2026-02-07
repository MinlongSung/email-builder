import type { Draggable, DraggableContainer, Droppable, DroppableContainer, Scrollable, ScrollableContainer } from "./types";

export class RectTracker {
    private draggableContainer: DraggableContainer | null = null;
    private droppableContainers: Map<string, DroppableContainer> = new Map();
    private scrollableContainers: Map<string, ScrollableContainer> = new Map();
    private ro: ResizeObserver | null = null;

    constructor() {
        if (typeof window !== 'undefined' && typeof ResizeObserver !== 'undefined') {
            this.ro = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const id = (entry.target as HTMLElement).dataset.id;
                    if (!id) continue;
                    const container = this.droppableContainers.get(id);
                    if (container) container.dirty = true;
                }
            });
        }
    }

    getDraggableContainer(): DraggableContainer | null {
        return this.draggableContainer;
    }

    getDroppableContainers(): DroppableContainer[] {
        return Array.from(this.droppableContainers.values());
    }

    getScrollableContainers(): ScrollableContainer[] {
        return Array.from(this.scrollableContainers.values());
    }

    start({ draggable, droppables, scrollables }: {
        draggable: Draggable,
        droppables: Droppable[],
        scrollables: Scrollable[],
    }) {
        this.draggableContainer = {
            ...draggable,
            rect: draggable.element.getBoundingClientRect()
        };

        droppables.forEach(droppable => {
            const rect = droppable.element.getBoundingClientRect();
            droppable.element.setAttribute("data-id", droppable.id);
            const container = { ...droppable, rect, dirty: false };
            this.droppableContainers.set(droppable.id, container);
            this.ro?.observe(droppable.element);
        });

        scrollables.forEach(scrollable => {
            scrollable.element.addEventListener('scroll', this.onScroll);
            this.scrollableContainers.set(scrollable.id, { ...scrollable, rect: scrollable.element.getBoundingClientRect() });
        });
    }

    onScroll = () => {
        this.droppableContainers.forEach(d => d.dirty = true);
    }

    measureDirtyDroppables() {
        for (const d of this.droppableContainers.values()) {
            if (!d.dirty) continue;

            d.rect = d.element.getBoundingClientRect();
            d.dirty = false;
        }
    }

    stop() {
        this.draggableContainer = null;

        this.droppableContainers.forEach(d => {
            d.element.removeAttribute("data-id");
            this.ro?.unobserve(d.element);
        });
        this.droppableContainers.clear();

        this.scrollableContainers.forEach(s => {
            s.element.removeEventListener("scroll", this.onScroll)
        });
        this.scrollableContainers.clear();
    }
}
