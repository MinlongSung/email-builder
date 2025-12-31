import type { DndState } from "@/dnd/core/types";
import type { RowEntity } from "@/entities/template";
import { CloneRowCommand } from "@/history/commands/CloneRowCommand";
import { DeleteRowCommand } from "@/history/commands/DeleteRowCommand";
import { MoveRowCommand } from "@/history/commands/MoveRowCommand";
import { historyService } from "@/history/services/historyService";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useUIStore } from "@/stores/useUIStore";

export const useRow = (row: RowEntity) => {
  const viewMode = useUIStore((state) => state.viewMode);
  const template = useCanvasStore((state) => state.template);
  const setTemplate = useCanvasStore((state) => state.setTemplate);
  const getRowCoordinates = useCanvasStore((state) => state.getRowCoordinates);

  const isMobileView = viewMode === "mobile";
  const shouldStack = isMobileView && row.isResponsive;

  const cloneRow = () => {
    if (!template) return;
    const rowIndex = getRowCoordinates(row.id);
    if (rowIndex === null) return;

    historyService.executeCommand(
      new CloneRowCommand({
        template,
        setTemplate,
        rowIndex,
        type: "row.clone",
      })
    );
  };

  const deleteRow = () => {
    if (!template) return;
    const rowIndex = getRowCoordinates(row.id);
    if (rowIndex === null) return;

    historyService.executeCommand(
      new DeleteRowCommand({
        template,
        setTemplate,
        rowIndex,
        type: "row.delete",
      })
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
        template,
        setTemplate,
        oldIndex,
        newIndex,
        type: "row.move",
      })
    );
  };

  return {
    shouldStack,
    cloneRow,
    deleteRow,
    moveRow,
  };
};
