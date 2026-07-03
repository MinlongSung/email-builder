import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DndManager,
  type DndManagerOptions,
} from "@/features/dnd/core/DndManager";
import type { DndState } from "@/features/dnd/core/types";
import { DndContext } from "@/features/dnd/adapter/contexts/DndContext";
import { pointerWithin } from "@/features/dnd/core/utils";
import { MouseSensor } from "@/features/dnd/core/sensors/MouseSensor";
import { TouchSensor } from "@/features/dnd/core/sensors/TouchSensor";

type DndResolvers = {
  onDragMove?: (state: DndState) => DndState;
  onDrop?: (state: DndState) => DndState;
};

export interface DndProviderProps extends DndManagerOptions {
  children: ReactNode | ((state: DndState) => ReactNode);
  resolvers?: DndResolvers;
}

export function DndProvider({
  children,
  callbacks,
  resolvers,
  scrollOptions,
  collisionDetection = pointerWithin,
  sensors = [
    [MouseSensor, { activationConstraint: { hold: 0, distance: 5 } }],
    [
      TouchSensor,
      { activationConstraint: { hold: 150, distance: 5, tolerance: 10 } },
    ],
  ],
}: DndProviderProps) {
  const [manager] = useState<DndManager>(
    () =>
      new DndManager({ callbacks, sensors, scrollOptions, collisionDetection }),
  );

  const [snapshot, setSnapshot] = useState<DndState>({
    coordinates: { x: 0, y: 0 },
    dragged: null,
    over: null,
    droppables: {},
    droppedOn: null,
    isTopHalf: false,
    isLeftHalf: false,
  });

  const subscribe = useCallback(
    (onChange: () => void) => {
      const onDragStart = (state: DndState) => {
        setSnapshot(state);
        onChange();
      };
      const onDragMove = (state: DndState) => {
        const nextState = resolvers?.onDragMove?.(state) ?? state;
        setSnapshot(nextState);
        onChange();
      };
      const onDrop = (state: DndState) => {
        const nextState = resolvers?.onDrop?.(state) ?? state;
        setSnapshot(nextState);
        onChange();
      };
      const onDragEnd = (state: DndState) => {
        setSnapshot(state); 
        onChange();
      };
      const onDragCancel = (state: DndState) => {
        setSnapshot(state);
        onChange();
      };

      manager.on("dragStart", onDragStart);
      manager.on("dragMove", onDragMove);
      manager.on("drop", onDrop);
      manager.on("dragEnd", onDragEnd);
      manager.on("dragCancel", onDragCancel);

      return () => {
        manager.off("dragStart", onDragStart);
        manager.off("dragMove", onDragMove);
        manager.off("drop", onDrop);
        manager.off("dragEnd", onDragEnd);
        manager.off("dragCancel", onDragCancel);
        manager.destroy();
      };
    },
    [manager],
  );

  const state = useSyncExternalStore(subscribe, () => snapshot);

  const contextValue = useMemo(() => ({ manager, state }), [manager, state]);

  return (
    <DndContext.Provider value={contextValue}>
      {typeof children === "function" ? children(state) : children}
    </DndContext.Provider>
  );
}
