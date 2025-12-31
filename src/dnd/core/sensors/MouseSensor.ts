import type { Sensor, Coordinates } from "@/dnd/core/types";
import { MOUSE_BUTTON, type MouseSensorConfig } from "@/dnd/core/sensors/types";

export class MouseSensor implements Sensor {
  private callback?: (event: Event) => void;
  private initialCoordinates?: Coordinates;
  private dragTimeout?: ReturnType<typeof setTimeout>;
  private isDragging = false;
  private config: Required<MouseSensorConfig> = {
    activationHold: 0,
    activationDistance: 5,
  };

  constructor(config?: MouseSensorConfig) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  attach() {
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  detach() {
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  onEvent(callback: (event: Event) => void) {
    this.callback = callback;
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (e.button !== MOUSE_BUTTON.left) return;
    this.initialCoordinates = { x: e.clientX, y: e.clientY };
    this.isDragging = false;

    const start = () => {
      this.isDragging = true;
      this.callback?.(e);
    };

    if (this.config.activationHold > 0) {
      this.dragTimeout = setTimeout(start, this.config.activationHold);
      return;
    }

    start();
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.initialCoordinates) return;

    const dx = e.clientX - this.initialCoordinates.x;
    const dy = e.clientY - this.initialCoordinates.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= this.config.activationDistance) {
      clearTimeout(this.dragTimeout);
      this.isDragging = true;
      e.preventDefault();
      this.callback?.(e);
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (!this.isDragging) {
      clearTimeout(this.dragTimeout);
      return;
    }
    this.initialCoordinates = undefined;
    this.isDragging = false;
    this.callback?.(e);
  };
}
