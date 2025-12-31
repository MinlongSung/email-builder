import type {
  DndState,
  DragLifecycleConfig,
  Predicate,
} from "@/dnd/core/types";
import type { CollisionDetector } from "@/dnd/core/CollisionDetector";
import type { AutoScroller } from "@/dnd/core/AutoScroller";
import type { EventEmitter } from "@/dnd/core/EventEmitter";
import { checkIsTopHalf } from "@/dnd/core/utils/checkIsTopHalf";

export class DragLifecycleManager {
  private state: DndState = {
    dragged: null,
    droppedOn: null,
    coordinates: { x: 0, y: 0 },
    isDragging: false,
    isTopHalf: false,
  };

  private rafId: number | null = null;

  private collisionDetector: CollisionDetector;
  private autoScroller: AutoScroller;
  private config: DragLifecycleConfig;
  private eventEmitter: EventEmitter;
  private predicate: Predicate;

  constructor(
    collisionDetector: CollisionDetector,
    autoScroller: AutoScroller,
    config: DragLifecycleConfig,
    predicate: Predicate,
    eventEmitter: EventEmitter
  ) {
    this.collisionDetector = collisionDetector;
    this.autoScroller = autoScroller;
    this.config = config;
    this.predicate = predicate;
    this.eventEmitter = eventEmitter;
  }

  handleSensorEvent(event: Event): void {
    switch (event.type) {
      case "mousedown":
      case "touchstart":
        this.dragStart(event);
        break;
      case "mousemove":
      case "touchmove":
        this.dragMove(event);
        break;
      case "mouseup":
      case "touchend":
        this.dragEnd();
        break;
    }
  }

  getState(): DndState {
    return this.state;
  }

  private dragStart(event: Event): void {
    const target = event.target as HTMLElement;

    const draggable = this.config.resolveDraggable(event, this.predicate);
    if (!draggable || draggable.disabled) return;

    if (draggable.handle && this.config.resolveHandle) {
      const handleEl = this.config.resolveHandle(target);
      if (!handleEl) return;
    }

    document.body.style.userSelect = "none";
    document.body.style.touchAction = "none";

    const coordinates = this.collisionDetector.getEventCoordinates(event);
    this.state = {
      dragged: draggable,
      droppedOn: null,
      coordinates,
      isDragging: true,
      isTopHalf: false,
    };

    this.eventEmitter.emit("dragStart", this.state);
    this.config?.onDragStart?.(this.state);
  }

  private dragMove(event: Event): void {
    if (!this.state.isDragging || !this.state.dragged) return;

    event.preventDefault(); // prevents scroll container on touch while dragging

    const coordinates = this.collisionDetector.getEventCoordinates(event);
    this.state.coordinates = coordinates;

    if (this.rafId) cancelAnimationFrame(this.rafId);

    this.rafId = requestAnimationFrame(() => {
      const droppable = this.collisionDetector.findValidDroppable(
        coordinates,
        this.state.dragged!
      );
      this.state.droppedOn = droppable;
      if (this.state.droppedOn) {
        this.state.isTopHalf = checkIsTopHalf(
          this.state.droppedOn.element,
          coordinates.y
        );
      }

      this.handleAutoScroll();
      this.eventEmitter.emit("dragMove", this.state);
      this.config?.onDragMove?.(this.state);
      this.rafId = null;
    });
  }

  private dragEnd(): void {
    if (!this.state.dragged) return;

    document.body.style.userSelect = "";
    document.body.style.touchAction = "";

    this.state.dragged.onDragEnd?.({ ...this.state });
    this.config.onDragEnd?.({ ...this.state });
    this.eventEmitter.emit("dragEnd", { ...this.state });

    this.state = {
      dragged: null,
      droppedOn: null,
      coordinates: { x: 0, y: 0 },
      isDragging: false,
      isTopHalf: false,
    };

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.autoScroller.stop();

    this.config.onDragEnd?.({ ...this.state });
    this.eventEmitter.emit("dragEnd", { ...this.state });
  }

  private handleAutoScroll(): void {
    this.autoScroller.start(
      () => this.state.coordinates,
      () => this.state.isDragging
    );
  }
}
