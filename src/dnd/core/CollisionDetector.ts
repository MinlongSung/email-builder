import type { Coordinates, Draggable, Droppable } from "@/dnd/core/types";
import type { DndRegistry } from "@/dnd/core/DndRegistry";

export class CollisionDetector {
  private registry: DndRegistry;

  constructor(registry: DndRegistry) {
    this.registry = registry;
  }

  findValidDroppable(
    coordinates: Coordinates,
    dragged: Draggable
  ): Droppable | null {
    const elementsAtPoint = document.elementsFromPoint(
      coordinates.x,
      coordinates.y
    ) as HTMLElement[];

    for (const el of elementsAtPoint) {
      for (const droppable of this.registry.getAllDroppables()) {
        if (droppable.disabled) continue;
        const elementMatch =
          droppable.element === el || droppable.element.contains(el);

        const accepts = droppable.data?.accepts;
        const typeMatch =
          accepts && accepts?.length
            ? accepts.includes(dragged.data.type)
            : false;
      
        if (elementMatch && typeMatch) {
          return droppable;
        }
      }
    }

    return null;
  }

  getEventCoordinates(event: Event): Coordinates {
    let x = 0;
    let y = 0;

    if (event instanceof MouseEvent) {
      x = event.clientX;
      y = event.clientY;
    } else if (event instanceof TouchEvent) {
      const t = event.touches[0] || event.changedTouches[0];
      x = t.clientX;
      y = t.clientY;
    }

    return { x, y };
  }
}
