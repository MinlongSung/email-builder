import { DRAGGABLES_REGISTRY } from "@/components/blocks";
import { BLOCKS_CATALOG } from "@/data/blocksCatalog";
import { Draggable } from "@/dnd/adapter/components/Draggable";
import type { DndState } from "@/dnd/core/types";
import type { BlockEntity } from "@/entities/template";
import { AddBlockCommand } from "@/history/commands/AddBlockCommand";
import { historyService } from "@/history/services/historyService";
import styles from "@/layouts/sidebarTabs/BlocksTab.module.css";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { generateId } from "@/utils/generateId";

export const BlocksTab = () => {
  const template = useCanvasStore((store) => store.template);
  const setTemplate = useCanvasStore((store) => store.setTemplate);

  const getColumnCoordinates = useCanvasStore(
    (store) => store.getColumnCoordinates
  );
  const getBlockCoordinates = useCanvasStore(
    (store) => store.getBlockCoordinates
  );

  const handleAdd = (state: DndState) => {
    if (!state.dragged || !state.droppedOn) return;
    const sourceBlock = state.dragged.data.item as BlockEntity;
    const newBlock: BlockEntity = {
      ...sourceBlock,
      id: generateId(),
    };

    let coords = getBlockCoordinates(state.droppedOn.id);
    if (!coords) {
      const columnCoords = getColumnCoordinates(state.droppedOn.id);
      if (!columnCoords) return;
      coords = { ...columnCoords, blockIndex: 0 };
    }

    coords.blockIndex += state.isTopHalf ? 0 : 1;

    const command = new AddBlockCommand({
      template,
      setTemplate,
      block: newBlock,
      rowIndex: coords.rowIndex,
      columnIndex: coords.columnIndex,
      blockIndex: coords.blockIndex,
      type: "block.add",
    });
    historyService.executeCommand(command);
  };

  return (
    <div className={styles.blocksGrid}>
      {BLOCKS_CATALOG.map((block) => (
        <Draggable
          key={block.id}
          id={block.id}
          accepts={[]}
          type={block.type}
          item={block}
          onDragEnd={handleAdd}
        >
          {({ setNodeRef, beingDragged }) => (
            <div ref={setNodeRef} style={{ opacity: beingDragged ? 0.7 : 1 }}>
              {DRAGGABLES_REGISTRY[block.type].sidebar(block as never)}
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};
