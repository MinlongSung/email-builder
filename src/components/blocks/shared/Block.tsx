import { useTranslation } from "react-i18next";

import { BLOCK_TYPES, type BlockEntity } from "@/entities/template";
import { DRAGGABLES_REGISTRY } from "@/components/blocks";
import { useEditorStore } from "@/stores/useEditorStore";
import { CloneBlockCommand } from "@/history/commands/CloneBlockCommand";
import { historyService } from "@/history/services/historyService";
import { DeleteBlockCommand } from "@/history/commands/DeleteBlockCommand";
import { SelectionCard } from "@/components/blocks/shared/SelectionCard";
import {
  CloneAction,
  DeleteAction,
  MoveAction,
} from "@/components/blocks/shared/SelectionCardActions";
import { MoveBlockCommand } from "@/history/commands/MoveBlockCommand";
import { Draggable } from "@/dnd/adapter/components/Draggable";
import type { DndState } from "@/dnd/core/types";
import { DropIndicator } from "@/dnd/adapter/components/DropIndicator";

interface BlockProps {
  block: BlockEntity;
}

export const Block: React.FC<BlockProps> = ({ block }) => {
  const { t } = useTranslation();
  const template = useEditorStore((state) => state.template);
  const setTemplate = useEditorStore((state) => state.setTemplate);
  const getBlockCoordinates = useEditorStore(
    (state) => state.getBlockCoordinates
  );
  const getColumnCoordinates = useEditorStore(
    (store) => store.getColumnCoordinates
  );

  const handleClone = () => {
    if (!template) return;
    const blockCoordinates = getBlockCoordinates(block.id);
    if (blockCoordinates === null) return;

    const command = new CloneBlockCommand({
      ...blockCoordinates,
      template,
      setTemplate,
      type: "block.clone",
    });
    historyService.executeCommand(command);
  };

  const handleDelete = () => {
    if (!template) return;
    const blockCoordinates = getBlockCoordinates(block.id);
    if (blockCoordinates === null) return;

    const command = new DeleteBlockCommand({
      ...blockCoordinates,
      template,
      setTemplate,
      type: "block.delete",
    });
    historyService.executeCommand(command);
  };

  const handleMove = (state: DndState) => {
    if (!state.dragged || !state.droppedOn) return;

    const fromCoords = getBlockCoordinates(state.dragged.id);
    if (!fromCoords) return;

    let toCoords = getBlockCoordinates(state.droppedOn.id);
    if (!toCoords) {
      const columnCoords = getColumnCoordinates(state.droppedOn.id);
      if (!columnCoords) return;
      toCoords = { ...columnCoords, blockIndex: 0 };
    }

    const isSameRow = fromCoords.rowIndex === toCoords.rowIndex;
    const isSameColumn =
      isSameRow && fromCoords.columnIndex === toCoords.columnIndex;
    const isSameBlock =
      isSameColumn && fromCoords.blockIndex === toCoords.blockIndex;

    if (isSameBlock) return;

    toCoords.blockIndex += state.isTopHalf ? 0 : 1;

    // Ajustar si estamos moviendo hacia abajo en la misma columna
    if (isSameColumn && fromCoords.blockIndex < toCoords.blockIndex) {
      toCoords.blockIndex -= 1;
    }

    const command = new MoveBlockCommand({
      template,
      setTemplate,
      fromRow: fromCoords.rowIndex,
      fromCol: fromCoords.columnIndex,
      fromBlock: fromCoords.blockIndex,
      toRow: toCoords.rowIndex,
      toCol: toCoords.columnIndex,
      toBlock: toCoords.blockIndex,
      type: "block.move",
    });
    historyService.executeCommand(command);
  };

  return (
    <Draggable
      id={block.id}
      accepts={BLOCK_TYPES}
      item={block}
      type={block.type}
      handle={"[data-drag-handle]"}
      onDragEnd={handleMove}
    >
      {({ setNodeRef, overId, isTopHalf, beingDragged }) => (
        <SelectionCard
          ref={setNodeRef}
          id={block.id}
          label={t(block.type)}
          actions={[
            <MoveAction label={t("move")} />,
            <CloneAction label={t("clone")} onClick={handleClone} />,
            <DeleteAction label={t("delete")} onClick={handleDelete} />,
          ]}
        >
          {overId === block.id && isTopHalf && (
            <DropIndicator label={t("drop_here")} />
          )}
          <div style={{ opacity: beingDragged ? 0.7 : 1 }}>
            {DRAGGABLES_REGISTRY[block.type].interactable(block as never)}
          </div>
          {overId === block.id && !isTopHalf && (
            <DropIndicator label={t("drop_here")} />
          )}
        </SelectionCard>
      )}
    </Draggable>
  );
};
