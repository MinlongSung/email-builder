import { CloneBlockCommand } from "@/commands/blocks/CloneBlockCommand";
import { DeleteBlockCommand } from "@/commands/blocks/DeleteBlockCommand";
import { MoveBlockCommand } from "@/commands/blocks/MoveBlockCommand";
import type { DndState } from "@/dnd/core/types";
import type { BlockEntity } from "@/entities/template";
import { historyService } from "@/history/services/historyService";

import { useCanvasStore } from "@/stores/useCanvasStore";
import { generateId } from "@/utils/generateId";

export const useBlock = (block: BlockEntity) => {
  const getTemplate = useCanvasStore((s) => s.getTemplate);
  const setTemplate = useCanvasStore((s) => s.setTemplate);
  const getBlockCoordinates = useCanvasStore((s) => s.getBlockCoordinates);
  const getColumnCoordinates = useCanvasStore((s) => s.getColumnCoordinates);

  const cloneBlock = () => {
    const coords = getBlockCoordinates(block.id);
    if (!coords) return;

    historyService.executeCommand(
      new CloneBlockCommand({
        ...coords,
        getTemplate,
        setTemplate,
        generateId,
      }),
      {
        id: generateId(),
        type: "block.clone",
        timestamp: Date.now(),
      }
    );
  };

  const removeBlock = () => {
    const coords = getBlockCoordinates(block.id);
    if (!coords) return;

    historyService.executeCommand(
      new DeleteBlockCommand({
        ...coords,
        getTemplate,
        setTemplate,
      }),
      {
        id: generateId(),
        type: "block.delete",
        timestamp: Date.now(),
      }
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
      from.rowIndex === to.rowIndex && from.columnIndex === to.columnIndex;

    to.blockIndex += state.isTopHalf ? 0 : 1;

    if (sameColumn && from.blockIndex < to.blockIndex) {
      to.blockIndex -= 1;
    }

    historyService.executeCommand(
      new MoveBlockCommand({
        getTemplate,
        setTemplate,
        fromRow: from.rowIndex,
        fromCol: from.columnIndex,
        fromBlock: from.blockIndex,
        toRow: to.rowIndex,
        toCol: to.columnIndex,
        toBlock: to.blockIndex,
      }),
      {
        id: generateId(),
        type: "block.move",
        timestamp: Date.now(),
      }
    );
  };

  return { cloneBlock, removeBlock, moveBlock };
};
