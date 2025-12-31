import { useLayoutEffect, useRef } from "react";
import { useDragAndDrop } from "@/dnd/adapter/hooks/useDragAndDrop";

export interface DroppableProps {
  id: string;
  data?: any;
  disabled?: boolean;
}

export const useDroppable = ({ id, data, disabled }: DroppableProps) => {
  const { dndManager, state } = useDragAndDrop();
  const node = useRef<HTMLElement | null>(null);
  const setNodeRef = (el: HTMLElement | null) => {
    node.current = el;
  };

  useLayoutEffect(() => {
    if (!node.current || !dndManager) return;
    dndManager.registerDroppable({
      id,
      element: node.current,
      data,
      disabled,
    });

    return () => {
      dndManager.unregisterDroppable(id);
    };
  }, [dndManager, id, data, disabled]);

  return {
    setNodeRef,
    isOver: state.droppedOn?.id === id,
    overId: state.droppedOn?.id,
    isDragging: state.isDragging,
    isTopHalf: state.isTopHalf,
  };
};
