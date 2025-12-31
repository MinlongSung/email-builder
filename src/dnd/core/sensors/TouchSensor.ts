import type { Sensor, Coordinates } from "@/dnd/core/types";
import type { TouchSensorConfig } from "@/dnd/core/sensors/types";

export class TouchSensor implements Sensor {
  private callback?: (event: Event) => void;
  private initialCoordinates?: Coordinates;
  private dragTimeout?: ReturnType<typeof setTimeout>;
  private isDragging = false;
  private config: Required<TouchSensorConfig> = {
    activationHold: 150,
    activationDistance: 5,
  };

  constructor(config?: TouchSensorConfig) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  attach() {
    window.addEventListener("touchstart", this.onTouchStart, {
      passive: false, // prevent scroll while dragging
    });
    window.addEventListener("touchmove", this.onTouchMove, { passive: false });
    window.addEventListener("touchend", this.onTouchEnd);
    window.addEventListener("touchcancel", this.onTouchEnd);
  }

  detach() {
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);
    window.removeEventListener("touchcancel", this.onTouchEnd);
  }

  onEvent(callback: (event: Event) => void) {
    this.callback = callback;
  }

  private onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    this.initialCoordinates = { x: touch.clientX, y: touch.clientY };
    this.isDragging = false;

    this.dragTimeout = setTimeout(() => {
      this.isDragging = true;
      this.callback?.(e);
    }, this.config.activationHold);
  };

  private onTouchMove = (e: TouchEvent) => {
    if (!this.initialCoordinates) return;

    const touch = e.touches[0];
    if (!touch) return;

    const dx = touch.clientX - this.initialCoordinates.x;
    const dy = touch.clientY - this.initialCoordinates.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= this.config.activationDistance) {
      clearTimeout(this.dragTimeout);
      this.isDragging = true;
      this.callback?.(e);
    }
  };

  private onTouchEnd = (e: TouchEvent) => {
    if (this.isDragging) this.callback?.(e);
    clearTimeout(this.dragTimeout);
    this.initialCoordinates = undefined;
    this.isDragging = false;
  };
}
