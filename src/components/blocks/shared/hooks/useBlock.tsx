import type { DndState } from "@/dnd/core/types";
import type { BlockEntity } from "@/entities/template";
import { CloneBlockCommand } from "@/history/commands/CloneBlockCommand";
import { DeleteBlockCommand } from "@/history/commands/DeleteBlockCommand";
import { MoveBlockCommand } from "@/history/commands/MoveBlockCommand";
import { historyService } from "@/history/services/historyService";
import { useEditorStore } from "@/stores/useEditorStore";

export const useBlock = (block: BlockEntity) => {
  const template = useEditorStore((s) => s.template);
  const setTemplate = useEditorStore((s) => s.setTemplate);
  const getBlockCoordinates = useEditorStore((s) => s.getBlockCoordinates);
  const getColumnCoordinates = useEditorStore((s) => s.getColumnCoordinates);

  const cloneBlock = () => {
    if (!template) return;
    const coords = getBlockCoordinates(block.id);
    if (!coords) return;

    historyService.executeCommand(
      new CloneBlockCommand({
        ...coords,
        template,
        setTemplate,
        type: "block.clone",
      })
    );
  };

  const removeBlock = () => {
    if (!template) return;
    const coords = getBlockCoordinates(block.id);
    if (!coords) return;

    historyService.executeCommand(
      new DeleteBlockCommand({
        ...coords,
        template,
        setTemplate,
        type: "block.delete",
      })
    );
  };

  const moveBlock = (state: DndState) => {
    if (!state.dragged || !state.droppedOn) return;

    const from = getBlockCoordinates(state.dragged.id);
    if (!from) return;

    let to = getBlockCoordinates(state.droppedOn.id);
    if (!to) {
      const col = getColumnCoordinates(state.droppedOn.id);
      if (!col) return;
      to = { ...col, blockIndex: 0 };
    }

    const sameColumn =
      from.rowIndex === to.rowIndex &&
      from.columnIndex === to.columnIndex;

    to.blockIndex += state.isTopHalf ? 0 : 1;

    if (sameColumn && from.blockIndex < to.blockIndex) {
      to.blockIndex -= 1;
    }

    historyService.executeCommand(
      new MoveBlockCommand({
        template,
        setTemplate,
        fromRow: from.rowIndex,
        fromCol: from.columnIndex,
        fromBlock: from.blockIndex,
        toRow: to.rowIndex,
        toCol: to.columnIndex,
        toBlock: to.blockIndex,
        type: "block.move",
      })
    );
  };

  return { cloneBlock, removeBlock, moveBlock };
};
