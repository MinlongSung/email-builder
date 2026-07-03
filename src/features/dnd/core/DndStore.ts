import type { DndState, Draggable, Droppable, Scrollable } from '@/features/dnd/core/types';

export class DndStore {
  private draggables: Map<string, Draggable> = new Map();
  private droppables: Map<string, Droppable> = new Map();
  private scrollables: Map<string, Scrollable> = new Map();

  private state!: DndState;

  constructor() {
    this.resetState();
  }

  registerDraggable(draggable: Draggable): void {
    this.draggables.set(draggable.id, draggable);
  }

  unregisterDraggable(id: string): void {
    this.draggables.delete(id);
  }

  getDraggable(id: string): Draggable | undefined {
    return this.draggables.get(id);
  }

  getDraggables(): Draggable[] {
    return Array.from(this.draggables.values());
  }

  registerDroppable(droppable: Droppable): void {
    this.droppables.set(droppable.id, droppable);
  }

  unregisterDroppable(id: string): void {
    this.droppables.delete(id);
  }

  getDroppable(id: string): Droppable | undefined {
    return this.droppables.get(id);
  }

  getDroppables(): Droppable[] {
    return Array.from(this.droppables.values());
  }

  registerScrollable(scrollable: Scrollable): void {
    this.scrollables.set(scrollable.id, scrollable);
  }

  unregisterScrollable(id: string): void {
    this.scrollables.delete(id);
  }

  getScrollable(id: string): Scrollable | undefined {
    return this.scrollables.get(id);
  }

  getScrollables(): Scrollable[] {
    return Array.from(this.scrollables.values());
  }

  updateState(updates: Partial<DndState>): void {
    this.state = { ...this.state, ...updates };
  }

  getState(): DndState {
    return this.state;
  }

  resetState(): void {
    this.state = {
      dragged: null,
      over: null,
      coordinates: { x: 0, y: 0 },
      droppables: {},
      droppedOn: null,
      isTopHalf: false,
      isLeftHalf: false,
    };
  }

  destroy() {
    this.draggables.clear();
    this.droppables.clear();
    this.scrollables.clear();
    this.resetState();
  }
}
