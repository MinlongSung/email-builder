import { createPortal } from "react-dom";
import { useDragAndDrop } from "@/dnd/adapter/hooks/useDragAndDrop";

export interface DragOverlayProps {
  children?: React.ReactNode;
}

export const DragOverlay = ({ children }: DragOverlayProps) => {
  const { state } = useDragAndDrop();

  if (!state.dragged) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0.7,
        cursor: 'grabbing',
        left: state.coordinates.x,
        top: state.coordinates.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {children}
    </div>,
    document.body
  );
};
