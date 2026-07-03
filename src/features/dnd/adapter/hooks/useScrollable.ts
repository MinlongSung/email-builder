import { useCallback, useEffect, useRef } from "react";
import { useDndContext } from "@/features/dnd/adapter/hooks/useDndContext";

export interface UseScrollableOptions {
  id: string;
}

export function useScrollable({ id }: UseScrollableOptions) {
  const { manager } = useDndContext();
  const nodeRef = useRef<HTMLElement | null>(null);

  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      if (nodeRef.current) {
        manager.unregisterScrollable(id);
      }

      nodeRef.current = node;

      if (node) {
        manager.registerScrollable({ id, element: node });
      }
    },
    [id, manager],
  );

  useEffect(() => {
    return () => {
      manager.unregisterScrollable(id);
    };
  }, [id, manager]);

  return { setNodeRef };
}
