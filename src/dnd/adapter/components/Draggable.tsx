import { useDraggable } from "@/dnd/adapter/hooks/useDraggable";
import { useDroppable } from "@/dnd/adapter/hooks/useDroppable";
import type { DndState } from "@/dnd/core/types";

export interface DraggableChildrenProps {
  isTopHalf: boolean;
  overId: string | undefined;
  beingDragged: boolean;
  setNodeRef: (el: HTMLElement | null) => void;
}

export interface DraggableProps {
  id: string;
  accepts: string[];
  type: string;
  item: any;
  handle?: string;
  disabled?: boolean;
  onDragEnd?: (state: DndState) => void;
  children: (props: DraggableChildrenProps) => React.ReactNode;
}

export const Draggable = ({
  id,
  accepts,
  type,
  item,
  handle,
  disabled,
  children,
  onDragEnd,
}: DraggableProps) => {
  const { setNodeRef: setDragRef, beingDragged } = useDraggable({
    id,
    data: { type, item },
    handle,
    disabled,
    onDragEnd,
  });

  const {
    setNodeRef: setDropRef,
    isTopHalf,
    overId,
  } = useDroppable({
    id,
    data: { accepts },
    disabled,
  });

  const setNodeRef = (el: HTMLElement | null) => {
    setDragRef(el);
    setDropRef(el);
  };

  return <>{children({ isTopHalf, overId, beingDragged, setNodeRef })}</>;
};
