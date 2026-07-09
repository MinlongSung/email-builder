import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DndManager,
  type DndManagerOptions,
} from "@/features/dnd/core/DndManager";
import type { DndState, DragResolvers } from "@/features/dnd/core/types";
import { DndContext } from "@/features/dnd/adapter/contexts/DndContext";
import { pointerWithin } from "@/features/dnd/core/utils";
import { MouseSensor } from "@/features/dnd/core/sensors/MouseSensor";
import { TouchSensor } from "@/features/dnd/core/sensors/TouchSensor";

export interface DndProviderProps extends DndManagerOptions {
  children: ReactNode | ((state: DndState) => ReactNode);
  resolvers?: DragResolvers;
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
  const manager = useMemo(
    () =>
      new DndManager({
        callbacks,
        resolvers,
        sensors,
        scrollOptions,
        collisionDetection,
      }),
    [],
  );

  useEffect(() => {
    manager.setOptions({ callbacks, resolvers });
  }, [manager, callbacks, resolvers]);

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
      const handleChange = (state: DndState) => {
        setSnapshot(state);
        onChange();
      };

      manager.on("dragStart", handleChange);
      manager.on("dragMove", handleChange);
      manager.on("drop", handleChange);
      manager.on("dragEnd", handleChange);
      manager.on("dragCancel", handleChange);

      return () => {
        manager.off("dragStart", handleChange);
        manager.off("dragMove", handleChange);
        manager.off("drop", handleChange);
        manager.off("dragEnd", handleChange);
        manager.off("dragCancel", handleChange);
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
