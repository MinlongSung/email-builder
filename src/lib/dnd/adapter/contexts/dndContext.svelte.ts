import { getContext, setContext } from "svelte";
import { DndManager } from "../../core/DndManager";
import { MouseSensor } from "../../core/sensors/MouseSensor";
import { TouchSensor } from "../../core/sensors/TouchSensor";
import type { DndState } from "../../core/types";
import { pointerWithin } from "../../core/utils";

export class DndStore {
    private _state: DndState = $state({
        draggable: null,
        droppable: null,
        coordinates: { x: 0, y: 0 },
        isTopHalf: false,
        isDragging: false,
    });

    constructor() { }

    private _manager = new DndManager({
        sensors: [
            [
                MouseSensor,
                { activationConstraint: { hold: 0, distance: 5 } },
            ],
            [
                TouchSensor,
                { activationConstraint: { hold: 150, distance: 5, tolerance: 10 } },
            ],
        ],
        scrollOptions: {
            enabled: true,
            threshold: 50,
            speed: 10
        },
        collisionDetection: pointerWithin,
        callbacks: {
            onDragStart: (state) => {
                this._state.draggable = state.draggable;
                this._state.coordinates = state.coordinates;
                this._state.isDragging = state.isDragging;
            },
            onDragMove: (state) => {
                this._state.coordinates = state.coordinates;
                this._state.droppable = state.droppable;
                this._state.isTopHalf = state.isTopHalf;

            },
            onDrop: () => {
                this._state.draggable = null;
                this._state.droppable = null;
                this._state.coordinates = { x: 0, y: 0 };
                this._state.isDragging = false;
            },
            onDragCancel: () => {
                this._state.draggable = null;
                this._state.droppable = null;
                this._state.coordinates = { x: 0, y: 0 };
                this._state.isDragging = false;
            }
        }
    });

    get manager(): DndManager {
        return this._manager;
    }

    get state(): DndState {
        return this._state;
    }

    get isDragging(): boolean {
        return this._state.isDragging;
    }

    get isTopHalf(): boolean {
        return this._state.isTopHalf;
    }

    get draggableId(): string | undefined {
        return this._state.draggable?.id;
    }

    get droppableId(): string | undefined {
        return this._state.droppable?.id;
    }

    get transferredData(): any {
        return this._state.draggable?.data.item;
    }

    get clientX(): number {
        return this._state.coordinates.x;
    }

    get clientY(): number {
        return this._state.coordinates.y;
    }
}

const CONTEXT_KEY = Symbol("dnd");

export function setDndContext() {
    const dndStore = new DndStore();
    setContext(CONTEXT_KEY, dndStore);
}

export function getDndContext() {
    return getContext<DndStore>(CONTEXT_KEY);
}