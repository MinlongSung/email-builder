import { useContext } from "react";
import {
  DndContext,
  type DndContextValue,
} from "@/features/dnd/adapter/contexts/DndContext";

export function useDndContext(): DndContextValue {
  const context = useContext(DndContext);
  if (!context) {
    throw new Error("useDndContext must be used within a DndProvider");
  }
  return context;
}
