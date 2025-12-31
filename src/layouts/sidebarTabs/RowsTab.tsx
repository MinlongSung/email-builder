import { DRAGGABLES_REGISTRY } from "@/components/blocks";
import { ROWS_CATALOG } from "@/data/rowsCatalog";
import { Draggable } from "@/dnd/adapter/components/Draggable";
import type { DndState } from "@/dnd/core/types";
import type { RowEntity } from "@/entities/template";
import { AddRowCommand } from "@/history/commands/AddRowCommand";
import { historyService } from "@/history/services/historyService";
import styles from "@/layouts/sidebarTabs/RowsTab.module.css";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { generateId } from "@/utils/generateId";

export const RowsTab = () => {
  const template = useCanvasStore((store) => store.template);
  const setTemplate = useCanvasStore((store) => store.setTemplate);
  const getRowCoordinates = useCanvasStore((store) => store.getRowCoordinates);

  const handleAdd = (state: DndState) => {
    if (!state.dragged || !state.droppedOn) return;
    const sourceRow = state.dragged?.data.item as RowEntity;
    const newRow: RowEntity = {
      ...sourceRow,
      id: generateId(),
      columns: sourceRow.columns.map((col) => ({
        ...col,
        id: generateId(),
        blocks: col.blocks.map((block) => ({
          ...block,
          id: generateId(),
        })),
      })),
    };

    let index = getRowCoordinates(state.droppedOn.id) ?? 0;
    index += state.isTopHalf ? 0 : 1;

    const command = new AddRowCommand({
      template,
      setTemplate,
      row: newRow,
      index,
      type: "row.add",
    });
    historyService.executeCommand(command);
  };
  return (
    <div className={styles.rowsGrid}>
      {ROWS_CATALOG.map((row) => (
        <Draggable
          key={row.id}
          id={row.id}
          accepts={[]}
          type={row.type}
          item={row}
          onDragEnd={handleAdd}
        >
          {({ setNodeRef, beingDragged }) => (
            <div ref={setNodeRef} style={{ opacity: beingDragged ? 0.7 : 1 }}>
              {DRAGGABLES_REGISTRY.row.sidebar(row)}
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};
