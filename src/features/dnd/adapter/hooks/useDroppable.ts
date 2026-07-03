import { useCallback, useEffect, useRef } from "react";
import { useDndContext } from "@/features/dnd/adapter/hooks/useDndContext";

export interface UseDroppableOptions {
  id: string;
  data?: unknown;
  disabled?: boolean;
}

export function useDroppable({
  id,
  data,
  disabled = false,
}: UseDroppableOptions) {
  const { manager, state } = useDndContext();
  const nodeRef = useRef<HTMLElement | null>(null);

  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      if (nodeRef.current) {
        manager.unregisterDroppable(id);
      }

      nodeRef.current = node;

      if (node) {
        manager.registerDroppable({ id, data, element: node, disabled });
      }
    },
    [id, data, disabled, manager],
  );

  useEffect(() => {
    return () => {
      manager.unregisterDroppable(id);
    };
  }, [id, manager]);

  const isOver = state.over?.id === id;
  const isTopHalf = isOver && state.isTopHalf;
  const isLeftHalf = isOver && state.isLeftHalf;
  const isDragging = !!state.dragged;
  const isBeingDragged = state.dragged?.id === id;

  return {
    setNodeRef,
    isDragging,
    isOver,
    isTopHalf,
    isLeftHalf,
    isBeingDragged,
  };
}
