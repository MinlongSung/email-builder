import { EventEmitter } from "@/dnd/core/EventEmitter";
import { CollisionDetector } from "@/dnd/core/CollisionDetector";
import { AutoScroller } from "@/dnd/core/AutoScroller";
import { SensorCoordinator } from "@/dnd/core/SensorCoordinator";
import { DragLifecycleManager } from "@/dnd/core/DragLifecycleManager";
import type { DndConfig, DndState, Draggable, Droppable } from "@/dnd/core/types";
import { DndRegistry } from "@/dnd/core/DndRegistry";

export class DndManager extends EventEmitter {
  private registry: DndRegistry;
  private collisionDetector: CollisionDetector;
  private autoScroller: AutoScroller;
  private sensorCoordinator: SensorCoordinator;
  private lifecycleManager: DragLifecycleManager;

  constructor(config: DndConfig) {
    super();

    // Inicializar todos los subsistemas
    this.registry = new DndRegistry();
    this.collisionDetector = new CollisionDetector(this.registry);
    this.autoScroller = new AutoScroller({
      enabled: config.autoScroll ?? true,
      scrollSpeed: config.scrollSpeed ?? 5,
      edgeThreshold: config.edgeThreshold ?? 50,
    });
    this.sensorCoordinator = new SensorCoordinator(config.sensors);
    this.lifecycleManager = new DragLifecycleManager(
      this.collisionDetector,
      this.autoScroller,
      config,
      (id: string) => this.registry.getDraggable(id),
      this
    );

    this.sensorCoordinator.attach((event) =>
      this.lifecycleManager.handleSensorEvent(event)
    );
  }

  registerDraggable(data: Draggable): void {
    this.registry.registerDraggable(data);
  }

  unregisterDraggable(id: string): void {
    this.registry.unregisterDraggable(id);
  }

  registerDroppable(data: Droppable): void {
    this.registry.registerDroppable(data);
  }

  unregisterDroppable(id: string): void {
    this.registry.unregisterDroppable(id);
  }

  getState(): DndState {
    return this.lifecycleManager.getState();
  }

  destroy(): void {
    this.registry.clear();
    this.sensorCoordinator.detach();
    this.autoScroller.stop();
  }
}
