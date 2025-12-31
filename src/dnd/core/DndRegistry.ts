import type { Draggable, Droppable } from "@/dnd/core/types";

export class DndRegistry {
  private draggables: Map<string, Draggable> = new Map();
  private droppables: Map<string, Droppable> = new Map();

  registerDraggable(data: Draggable): void {
    this.draggables.set(data.id, data);
  }

  unregisterDraggable(id: string): void {
    this.draggables.delete(id);
  }

  registerDroppable(data: Droppable): void {
    this.droppables.set(data.id, data);
  }

  unregisterDroppable(id: string): void {
    this.droppables.delete(id);
  }

  getDraggable(id: string): Draggable | undefined {
    return this.draggables.get(id);
  }

  getDroppable(id: string): Droppable | undefined {
    return this.droppables.get(id);
  }

  getAllDraggables(): IterableIterator<Draggable> {
    return this.draggables.values();
  }

  getAllDroppables(): IterableIterator<Droppable> {
    return this.droppables.values();
  }

  clear(): void {
    this.draggables.clear();
    this.droppables.clear();
  }
}
