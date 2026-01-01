import { DRAGGABLES_REGISTRY } from "@/components/blocks";
import { ROWS_CATALOG } from "@/data/rowsCatalog";
import { Draggable } from "@/dnd/adapter/components/Draggable";
import type { DndState } from "@/dnd/core/types";
import type { RowEntity } from "@/entities/template";
import { AddRowCommand } from "@/history/commands/AddRowCommand";
import { historyService } from "@/history/services/historyService";

import { useCanvasStore } from "@/stores/useCanvasStore";
import { generateId } from "@/utils/generateId";

export const RowsTab = () => {
  const template = useCanvasStore((store) => store.template);
  const setTemplate = useCanvasStore((store) => store.setTemplate);
  const getRowCoordinates = useCanvasStore((store) => store.getRowCoordinates);

  const handleAdd = (state: DndState) => {
    if (!state.dragged || !state.droppedOn) return;
    const sourceRow = state.dragged?.data.item as RowEntity;

    // Deep clone to avoid sharing nested objects (style, content)
    const newRow: RowEntity = structuredClone(sourceRow);

    // Assign new IDs to all elements
    newRow.id = generateId();
    newRow.columns.forEach((col) => {
      col.id = generateId();
      col.blocks.forEach((block) => {
        block.id = generateId();
      });
    });

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
    <section className={"rowsTab__grid"}>
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
    </section>
  );
};
