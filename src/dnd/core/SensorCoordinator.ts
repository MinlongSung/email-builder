import type { Sensor } from "@/dnd/core/types";

export type SensorEventHandler = (event: Event) => void;

export class SensorCoordinator {
  private sensors: Sensor[];
  private eventHandler: SensorEventHandler | null = null;

  constructor(sensors: Sensor[]) {
    this.sensors = sensors;
  }

  attach(handler: SensorEventHandler): void {
    this.eventHandler = handler;

    this.sensors.forEach((sensor) => {
      sensor.onEvent((event) => this.handleSensorEvent(event));
      sensor.attach();
    });
  }

  detach(): void {
    this.sensors.forEach((sensor) => sensor.detach());
    this.eventHandler = null;
  }

  private handleSensorEvent(event: Event): void {
    if (this.eventHandler) {
      this.eventHandler(event);
    }
  }
}
