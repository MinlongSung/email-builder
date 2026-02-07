import type { PointerEventHandlers, SensorProps } from "../types";
import { AbstractPointerSensor } from "./AbstractPointerSensor";

const events: PointerEventHandlers = {
  cancel: { name: "touchcancel" },
  move: { name: "touchmove" },
  end: { name: "touchend" },
};

export class TouchSensor extends AbstractPointerSensor {
  constructor(props: SensorProps) {
    super(props, events);
  }

  static activators = [
    {
      eventName: "touchstart" as const,
      handler: (event: TouchEvent) => {
        const { touches } = event;

        return touches.length > 1 ? false : true;
      },
    },
  ];
}
