import { useDndContext } from "@/features/dnd/adapter/hooks/useDndContext";
import { cn } from "@/components/utils/cn";

export const DropPlaceholder = ({ id }: { id: string }) => {
  const { state } = useDndContext();
  const isOver = state.droppedOn?.id === id;

  return (
    <div
      className={cn("min-h-23 w-full bg-yellow-500", isOver && "bg-green-500")}
    >
      {isOver ? "Dropping" : "Drop Here"}
    </div>
  );
};
