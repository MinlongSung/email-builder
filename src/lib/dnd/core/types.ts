export interface Draggable {
    id: string;
    data: any;
    element: HTMLElement;
    disabled?: boolean;
}

export interface Droppable {
    id: string;
    data: any;
    element: HTMLElement;
    disabled?: boolean;
}

export interface Scrollable {
    id: string;
    element: HTMLElement;
}

export interface DraggableContainer extends Draggable {
    rect: DOMRect;
}

export interface DroppableContainer extends Droppable {
    dirty: boolean;
    rect: DOMRect;
}

export interface ScrollableContainer extends Scrollable {
    rect: DOMRect;
}

export interface Coordinates {
    x: number;
    y: number;
}

export type PointerEventType = "mouse" | "touch" | "pen" | (string & {});

export interface ActivationConstraint {
    hold?: number;
    distance?: number; // la distancia mínima en píxeles que el puntero debe moverse para activar el drag
    tolerance?: number; // margen de error durante el hold; permite mover un poco el dedo/puntero sin cancelar la activación.
}

export interface SensorOptions {
    activationConstraint: ActivationConstraint;
}

export interface DragCallbacks {
    onDragStart?: (state: DndState) => void;
    onDragMove?: (state: DndState) => void;
    onDrop?: (state: DndState) => void;
    onDragCancel?: () => void;
}

export interface ScrollOptions {
    enabled?: boolean;
    threshold?: number;
    speed?: number;
}

interface CollisionDetectionOptions {
    draggable: DraggableContainer,
    droppables: DroppableContainer[]
    coordinates: Coordinates,
}

export type CollisionDetection = ({
    draggable,
    droppables,
    coordinates
}: CollisionDetectionOptions) => DroppableContainer[];

export interface DndState {
    coordinates: Coordinates;
    draggable: DraggableContainer | null;
    droppable: DroppableContainer | null;
    isTopHalf: boolean;
    isDragging: boolean;
}

export interface SensorProps {
    event: Event;
    options: SensorOptions;
    onStart(coordinates: Coordinates): void;
    onMove(coordinates: Coordinates): void;
    onEnd(): void;
    onCancel(): void;
}

export interface EventDescriptor {
    name: keyof DocumentEventMap;
    passive?: boolean;
}

export interface PointerEventHandlers {
    cancel?: EventDescriptor;
    move: EventDescriptor;
    end: EventDescriptor;
}

interface SensorClass {
    new(props: SensorProps): any;
    activators: SensorActivator[];
}
export type SensorDescriptor = [SensorClass, SensorOptions];

export interface SensorActivator {
    eventName: string;
    handler: (event: any) => boolean;
}

export interface DragEvents {
    dragStart: DndState;
    dragMove: DndState;
    drop: DndState;
    dragCancel: void;
}