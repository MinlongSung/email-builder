type PointerSensorConfig = {
  activationHold?: number;
  activationDistance?: number;
};

export type MouseSensorConfig = PointerSensorConfig;
export type TouchSensorConfig = PointerSensorConfig;

export const MOUSE_BUTTON = {
  left: 0,
  center: 1,
  right: 2,
} as const;
