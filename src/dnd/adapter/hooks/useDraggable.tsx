import { useLayoutEffect, useRef } from "react";
import type { DndState } from "@/dnd/core/types";
import { useDragAndDrop } from "@/dnd/adapter/hooks/useDragAndDrop";

export const useDraggable = ({
  id,
  data,
  handle,
  disabled,
  onDragEnd,
}: {
  id: string;
  data?: any;
  handle?: string;
  disabled?: boolean;
  onDragEnd?: (state: DndState) => void;
}) => {
  const { dndManager, state } = useDragAndDrop();

  const node = useRef<HTMLElement | null>(null);
  const setNodeRef = (el: HTMLElement | null) => {
    node.current = el;
    node.current?.setAttribute("data-draggable-id", id);
  };

  useLayoutEffect(() => {
    if (!dndManager || !node.current) return;
    dndManager.registerDraggable({
      id,
      element: node.current,
      data,
      handle,
      disabled,
      onDragEnd,
    });

    return () => {
      dndManager.unregisterDraggable(id);
    };
  }, [dndManager, id, data, disabled, handle, onDragEnd]);

  return {
    activeId: state.dragged?.id,
    overId: state.droppedOn?.id,
    beingDragged: state.dragged?.id === id,
    isDragging: state.isDragging,
    isTopHalf: state.isTopHalf,
    setNodeRef,
  };
};
