import { useCallback, useEffect, useRef } from "react";
import { useDndContext } from "@/features/dnd/adapter/hooks/useDndContext";

export interface UseDraggableOptions {
  id: string;
  data?: unknown;
  disabled?: boolean;
}

export function useDraggable({
  id,
  data,
  disabled = false,
}: UseDraggableOptions) {
  const { manager, state } = useDndContext();
  const nodeRef = useRef<HTMLElement | null>(null);
  const listenersRef = useRef<Record<string, (e: Event) => void> | null>(null);

  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      if (nodeRef.current && listenersRef.current) {
        Object.entries(listenersRef.current).forEach(([event, handler]) => {
          nodeRef.current!.removeEventListener(event, handler);
        });
        manager.unregisterDraggable(id);
        listenersRef.current = null;
      }

      nodeRef.current = node;

      if (node) {
        manager.registerDraggable({ id, data, element: node, disabled });
        const listeners = manager.createListeners(id);
        listenersRef.current = listeners;
        Object.entries(listeners).forEach(([event, handler]) => {
          node.addEventListener(event, handler);
        });
      }
    },
    [id, data, disabled, manager],
  );

  useEffect(() => {
    return () => {
      if (nodeRef.current && listenersRef.current) {
        Object.entries(listenersRef.current).forEach(([event, handler]) => {
          nodeRef.current!.removeEventListener(event, handler);
        });
        listenersRef.current = null;
      }
      manager.unregisterDraggable(id);
    };
  }, [id, manager]);

  const isDragging = !!state.dragged;
  const isBeingDragged = state.over?.id === id;

  return {
    setNodeRef,
    isDragging,
    isBeingDragged,
  };
}
