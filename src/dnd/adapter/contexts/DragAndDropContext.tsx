import { createContext } from "react";
import type { DndManager } from "@/dnd/core/DndManager";
import type { DndState } from "@/dnd/core/types";

interface IDragAndDropContext {
  dndManager: DndManager;
  state: DndState;
}
export const DragAndDropContext = createContext<IDragAndDropContext | null>(
  null
);
