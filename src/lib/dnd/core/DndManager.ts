
import { AutoScroller } from "./AutoScroller";
import { DndStore } from "./DndStore";
import { EventEmitter } from "./EventEmitter";
import { RectTracker } from "./RectTracker";
import type { CollisionDetection, Coordinates, DragCallbacks, DragEvents, Draggable, Droppable, Scrollable, ScrollOptions, SensorDescriptor, SensorProps } from "./types";

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
    }

    unregisterDraggable = (id: string) => {
        this.store.unregisterDraggable(id);
    }

    registerDroppable = (droppable: Droppable) => {
        this.store.registerDroppable(droppable);
    }

    unregisterDroppable = (id: string) => {
        this.store.unregisterDroppable(id);
    }

    registerScrollable = (scrollable: Scrollable): void => {
        this.store.registerScrollable(scrollable);
    }

    unregisterScrollable = (id: string): void => {
        this.store.unregisterScrollable(id);
    }

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
                            const scrollables = this.store.getScrollables()
                            const droppables = this.store.getDroppables();
                            this.rectTracker.start({
                                draggable,
                                droppables,
                                scrollables,
                            });
                            this.autoScroller.init({ scrollables });
                            this.store.updateState({
                                draggable: this.rectTracker.getDraggableContainer(),
                                coordinates,
                                isDragging: true,
                            });
                            const state = this.store.getState();
                            this.options.callbacks?.onDragStart?.(state);
                            this.emit('dragStart', state);
                        },
                        onMove: (coordinates: Coordinates) => {
                            const draggableContainer = this.rectTracker.getDraggableContainer();
                            if (!draggableContainer) return;
                            this.rectTracker.measureDirtyDroppables();
                            const collisions = this.options.collisionDetection?.({
                                draggable: draggableContainer,
                                droppables: this.rectTracker.getDroppableContainers(),
                                coordinates,
                            }) ?? [];

                            const droppable = collisions[0];

                            this.autoScroller.setActiveScrollable(coordinates);
                            this.autoScroller.updateCoordinates(coordinates);
                            this.autoScroller.start();

                            let isTopHalf;
                            if (droppable) {
                                const { top, height } = droppable.rect;
                                const middleY = top + height / 2;
                                isTopHalf = coordinates.y < middleY;
                            }
                            this.store.updateState({ coordinates, droppable, isTopHalf });
                            const state = this.store.getState();
                            this.options.callbacks?.onDragMove?.(state);
                            this.emit('dragMove', state);
                        },
                        onEnd: () => {
                            const state = this.store.getState();
                            this.options.callbacks?.onDrop?.(state);
                            this.emit('drop', state);
                            this.store.resetState();
                            this.rectTracker.stop();
                            this.autoScroller.stop();
                            this.activeSensor = null;
                        },
                        onCancel: () => {
                            this.options.callbacks?.onDragCancel?.();
                            this.emit('dragCancel');
                            this.store.resetState();
                            this.rectTracker.stop();
                            this.autoScroller.stop();
                            this.activeSensor = null;
                        }
                    };

                    this.activeSensor = new SensorClass(sensorProps);
                };
            });
        });

        return listeners;
    }

    destroy() {
        this.activeSensor = null;
        this.store.destroy();
        this.autoScroller.stop();
        this.rectTracker.stop();
    }

}