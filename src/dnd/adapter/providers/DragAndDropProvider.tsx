import { useLayoutEffect, useMemo, useState } from "react";
import { DndManager } from "@/dnd/core/DndManager";
import { MouseSensor } from "@/dnd/core/sensors/MouseSensor";
import { TouchSensor } from "@/dnd/core/sensors/TouchSensor";
import type { DndState } from "@/dnd/core/types";
import { DragAndDropContext } from "@/dnd/adapter/contexts/DragAndDropContext";
import { DragOverlay } from "@/dnd/adapter/components/DragOverlay";
import { DRAGGABLES_REGISTRY, type Draggable } from "@/components/blocks";

export const DragAndDropProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [dragState, setDragState] = useState<DndState>({
    dragged: null,
    droppedOn: null,
    coordinates: { x: 0, y: 0 },
    isDragging: false,
    isTopHalf: false,
  });

  const dndManager = useMemo(() => {
    return new DndManager({
      resolveDraggable: (event, predicate) => {
        const target = event.target as HTMLElement;
        const host = target.closest("[data-draggable-id]") as HTMLElement;
        if (!host) return null;
        return predicate(host.dataset.draggableId!) || null;
      },
      resolveHandle: (el) => el.closest("[data-drag-handle]"),
      sensors: [new MouseSensor(), new TouchSensor()],
    });
  }, []);

  useLayoutEffect(() => {
    const updateState = (newState: DndState) => {
      setDragState({ ...newState });
    };

    dndManager.on("dragStart", updateState);
    dndManager.on("dragMove", updateState);
    dndManager.on("dragEnd", updateState);

    return () => {
      dndManager.off("dragStart", updateState);
      dndManager.off("dragMove", updateState);
      dndManager.off("dragEnd", updateState);
    };
  }, [dndManager]);

  return (
    <DragAndDropContext.Provider value={{ dndManager, state: dragState }}>
      {children}
      <DragOverlay>
        {dragState.dragged &&
          DRAGGABLES_REGISTRY[
            dragState.dragged.data.type as Draggable["type"]
          ].sidebar(dragState.dragged.data.item)}
      </DragOverlay>
    </DragAndDropContext.Provider>
  );
};
