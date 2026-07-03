import type { PointerEventHandlers, SensorProps } from '@/features/dnd/core/types';
import { AbstractPointerSensor } from '@/features/dnd/core/sensors/AbstractPointerSensor';

const events: PointerEventHandlers = {
  move: { name: 'mousemove' },
  end: { name: 'mouseup' },
};

enum MouseButton {
  RightClick = 2,
}

export class MouseSensor extends AbstractPointerSensor {
  constructor(props: SensorProps) {
    super(props, events);
  }

  static activators = [
    {
      eventName: 'mousedown' as const,
      handler: (event: MouseEvent) => {
        if (event.button === MouseButton.RightClick) {
          return false;
        }

        return true;
      },
    },
  ];
}
