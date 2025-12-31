import { useDroppable } from "@/dnd/adapter/hooks/useDroppable";

export interface DroppableChildrenProps {
  overId: string | undefined;
  isOver: boolean;
  isTopHalf: boolean;
  setNodeRef: (el: HTMLElement | null) => void;
}
export interface DroppableProps {
  id: string;
  accepts: string[];
  children: (props: DroppableChildrenProps) => React.ReactNode;
}

export const Droppable = ({ id, accepts, children }: DroppableProps) => {
  const { setNodeRef, isOver, isTopHalf, overId } = useDroppable({
    id,
    data: { accepts },
  });

  return <>{children({ overId, isOver, isTopHalf, setNodeRef })}</>;
};
