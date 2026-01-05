import { CloneRowCommand } from "@/commands/rows/CloneRowCommand";
import { DeleteRowCommand } from "@/commands/rows/DeleteRowCommand";
import { MoveRowCommand } from "@/commands/rows/MoveRowCommand";
import type { DndState } from "@/dnd/core/types";
import type { RowEntity } from "@/entities/template";
import { historyService } from "@/history/services/historyService";

import { useCanvasStore } from "@/stores/useCanvasStore";
import { useUIStore } from "@/stores/useUIStore";
import { generateId } from "@/utils/generateId";

export const useRow = (row: RowEntity) => {
  const viewMode = useUIStore((state) => state.viewMode);
  const getTemplate = useCanvasStore((state) => state.getTemplate);
  const setTemplate = useCanvasStore((state) => state.setTemplate);
  const getRowCoordinates = useCanvasStore((state) => state.getRowCoordinates);

  const isMobileView = viewMode === "mobile";
  const shouldStack = isMobileView && row.isResponsive;

  const cloneRow = () => {
    const rowIndex = getRowCoordinates(row.id);
    if (rowIndex === null) return;

    historyService.executeCommand(
      new CloneRowCommand({
        getTemplate,
        setTemplate,
        rowIndex,
        generateId,
      }),
      {
        id: generateId(),
        type: "row.clone",
        timestamp: Date.now(),
      }
    );
  };

  const deleteRow = () => {
    const rowIndex = getRowCoordinates(row.id);
    if (rowIndex === null) return;

    historyService.executeCommand(
      new DeleteRowCommand({
        getTemplate,
        setTemplate,
        rowIndex,
      }),
      {
        id: generateId(),
        type: "row.delete",
        timestamp: Date.now(),
      }
    );
  };

  const moveRow = (state: DndState) => {
    if (!state.dragged || !state.droppedOn) return;

    const oldIndex = getRowCoordinates(state.dragged.id);
    let newIndex = getRowCoordinates(state.droppedOn.id);
    if (oldIndex === null || newIndex === null) return;

    newIndex += state.isTopHalf ? 0 : 1;
    if (oldIndex < newIndex) newIndex -= 1;
    if (oldIndex === newIndex) return;

    historyService.executeCommand(
      new MoveRowCommand({
        getTemplate,
        setTemplate,
        oldIndex,
        newIndex,
      }),
      {
        id: generateId(),
        type: "row.move",
        timestamp: Date.now(),
      }
    );
  };

  return {
    shouldStack,
    cloneRow,
    deleteRow,
    moveRow,
  };
};
