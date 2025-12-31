export interface Draggable {
  id: string;
  element: HTMLElement;
  data: any;
  handle?: string;
  disabled?: boolean;
  onDragEnd?: (state: DndState) => void;
}

export interface Droppable {
  id: string;
  data: any;
  element: HTMLElement;
  disabled?: boolean;
}

export type Coordinates = { x: number; y: number };

export interface DndState {
  dragged: Draggable | null;
  droppedOn: Droppable | null;
  coordinates: Coordinates;
  isDragging: boolean;
  isTopHalf: boolean;
}

export type Predicate = (id: string) => Draggable | undefined;

export interface DragLifecycleConfig {
  resolveDraggable: (event: Event, predicate: Predicate) => Draggable | null;
  resolveHandle?: (el: HTMLElement) => HTMLElement | null;
  onDragStart?: (state: DndState) => void;
  onDragMove?: (state: DndState) => void;
  onDragEnd?: (state: DndState) => void;
}

export interface DndConfig extends DragLifecycleConfig {
  edgeThreshold?: number;
  autoScroll?: boolean;
  scrollSpeed?: number;
  sensors: Sensor[];
}

export interface Sensor {
  attach(): void; // Comienza a escuchar eventos
  detach(): void; // Deja de escuchar eventos
  onEvent: (callback: (event: Event) => void) => void; // Sensor reporta eventos al manager
}

export interface DndEvents {
  dragStart: DndState;
  dragMove: DndState;
  dragEnd: DndState;
}

export type EventCallback<T = any> = (payload: T) => void;
