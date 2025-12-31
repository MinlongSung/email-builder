import { useContext } from "react";
import { DragAndDropContext } from "@/dnd/adapter/contexts/DragAndDropContext";

export const useDragAndDrop = () => {
  const context = useContext(DragAndDropContext);
  if (!context) {
    throw new Error("useDragAndDrop must be inside a DragAndDropProvider");
  }
  return context;
};
