import { useCallback, type MouseEvent } from "react";
import { useUIStore } from "@/stores/useUIStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDragAndDrop } from "@/dnd/adapter/hooks/useDragAndDrop";

interface UseSelectableElementOptions {
  shouldDismiss?: (event: Event) => boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
}

export function useSelectableElement(
  id: string,
  options: UseSelectableElementOptions = {}
) {
  const selectedId = useUIStore((state) => state.selectedId);
  const hoveredId = useUIStore((state) => state.hoveredId);
  const setSelectedId = useUIStore((state) => state.setSelectedId);
  const setHoveredId = useUIStore((state) => state.setHoveredId);
  const { dndManager } = useDragAndDrop();

  const isSelected = !dndManager.getState().isDragging && selectedId === id;
  const isHovered = !dndManager.getState().isDragging && hoveredId === id;
  const isHighlighted = isSelected || isHovered;

  const {
    shouldDismiss = (event) => {
      const target = event.target as HTMLElement;
      return !target.closest("[data-no-dismiss]");
    },
    onSelect,
    onDeselect,
  } = options;

  useClickOutside({
    enabled: isSelected,
    onDismiss: () => {
      setSelectedId(null);
      onDeselect?.();
    },
    shouldDismiss,
  });

  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (isHovered) return;
      setHoveredId(id);
    },
    [id, isHovered, setHoveredId]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, [setHoveredId]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (isSelected) return;
      setSelectedId(id);
      onSelect?.();
    },
    [id, isSelected, setSelectedId, onSelect]
  );

  return {
    isSelected,
    isHovered,
    isHighlighted,
    handlers: {
      onMouseOver: handleMouseOver,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
    },
  };
}
