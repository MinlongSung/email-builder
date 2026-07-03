import { useDndContext } from "@/features/dnd/adapter/hooks/useDndContext";

export const DragOverlay = ({ children }: { children?: React.ReactNode }) => {
  const { state } = useDndContext();
  const { x, y } = state.coordinates;
  const isDragging = !!state.dragged;
  if (!isDragging) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-10 opacity-70"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    >
      {children}
    </div>
  );
};
