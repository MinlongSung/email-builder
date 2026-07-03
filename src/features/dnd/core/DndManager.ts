import { AutoScroller } from "@/features/dnd/core/AutoScroller";
import { DndStore } from "@/features/dnd/core/DndStore";
import { EventEmitter } from "@/features/dnd/core/EventEmitter";
import { RectTracker } from "@/features/dnd/core/RectTracker";
import type {
  CollisionDetection,
  Coordinates,
  DragCallbacks,
  DragEvents,
  Draggable,
  Droppable,
  Scrollable,
  ScrollOptions,
  SensorDescriptor,
  SensorProps,
} from "@/features/dnd/core/types";
import { checkIsLeftHalf, checkIsTopHalf } from "@/features/dnd/core/utils";

export interface DndManagerOptions {
  sensors?: SensorDescriptor[];
  collisionDetection?: CollisionDetection;
  scrollOptions?: ScrollOptions;
  callbacks?: DragCallbacks;
}

export class DndManager extends EventEmitter<DragEvents> {
  private activeSensor: any | null = null;
  private store: DndStore = new DndStore();
  private rectTracker: RectTracker;
  private autoScroller: AutoScroller;

  constructor(private options: DndManagerOptions) {
    super();
    this.rectTracker = new RectTracker();
    this.autoScroller = new AutoScroller({
      enabled: options.scrollOptions?.enabled ?? true,
      threshold: options.scrollOptions?.threshold ?? 50,
      speed: options.scrollOptions?.speed ?? 10,
    });
  }

  registerDraggable = (draggable: Draggable) => {
    this.store.registerDraggable(draggable);
  };

  unregisterDraggable = (id: string) => {
    this.store.unregisterDraggable(id);
  };

  registerDroppable = (droppable: Droppable) => {
    this.store.registerDroppable(droppable);
  };

  unregisterDroppable = (id: string) => {
    this.store.unregisterDroppable(id);
  };

  registerScrollable = (scrollable: Scrollable): void => {
    this.store.registerScrollable(scrollable);
  };

  unregisterScrollable = (id: string): void => {
    this.store.unregisterScrollable(id);
  };

  createListeners = (id: string) => {
    const listeners: Record<string, (event: Event) => void> = {};

    this.options.sensors?.forEach(([SensorClass, sensorOptions]) => {
      SensorClass.activators.forEach((activator) => {
        listeners[activator.eventName] = (event: Event) => {
          if (this.activeSensor) return;
          const draggable = this.store.getDraggable(id);
          if (!draggable || draggable.disabled || !activator.handler(event)) {
            return;
          }

          const sensorProps: SensorProps = {
            event,
            options: sensorOptions,
            onStart: (coordinates: Coordinates) => {
              const scrollables = this.store.getScrollables();
              const droppables = this.store.getDroppables();
              this.rectTracker.start({
                draggable,
                droppables,
                scrollables,
              });
              this.autoScroller.init({ scrollables });
              this.store.updateState({
                dragged: this.rectTracker.getDraggableContainer(),
                coordinates,
              });
              const state = this.store.getState();
              this.options.callbacks?.onDragStart?.(state);
              this.emit("dragStart", state);
            },
            onMove: (coordinates: Coordinates) => {
              const draggableContainer =
                this.rectTracker.getDraggableContainer();
              if (!draggableContainer) return;
              this.rectTracker.measureDirtyDroppables();
              const droppables = this.rectTracker.getDroppableContainers();
              const collisions =
                this.options.collisionDetection?.({
                  draggable: draggableContainer,
                  droppables: Object.values(droppables),
                  coordinates,
                }) ?? [];

              const over = collisions[0];

              this.autoScroller.setActiveScrollable(coordinates);
              this.autoScroller.updateCoordinates(coordinates);
              this.autoScroller.start();

              const isTopHalf = over
                ? checkIsTopHalf(over.rect, coordinates)
                : false;
              const isLeftHalf = over
                ? checkIsLeftHalf(over.rect, coordinates)
                : false;

              this.store.updateState({
                coordinates,
                over,
                droppables,
                droppedOn: over,
                isTopHalf,
                isLeftHalf,
              });
              const state = this.store.getState();
              this.options.callbacks?.onDragMove?.(state);
              this.emit("dragMove", state);
            },
            onEnd: () => {
              let state = this.store.getState();
              this.options.callbacks?.onDrop?.(state);
              this.emit("drop", state);
              this.store.resetState();
              state = this.store.getState();
              this.options.callbacks?.onDragEnd?.(state);
              this.emit("dragEnd", state);
              this.rectTracker.stop();
              this.autoScroller.stop();
              this.activeSensor = null;
            },
            onCancel: () => {
              this.options.callbacks?.onDragCancel?.();
              this.emit("dragCancel");
              this.store.resetState();
              this.rectTracker.stop();
              this.autoScroller.stop();
              this.activeSensor = null;
            },
          };

          this.activeSensor = new SensorClass(sensorProps);
        };
      });
    });

    return listeners;
  };

  destroy() {
    this.activeSensor = null;
    this.store.destroy();
    this.autoScroller.stop();
    this.rectTracker.stop();
  }
}
