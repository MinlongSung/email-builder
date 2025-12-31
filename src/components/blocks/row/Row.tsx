import { Fragment } from "react";
import { useUIStore } from "@/stores/useUIStore";
import { useEditorStore } from "@/stores/useEditorStore";
import { historyService } from "@/history/services/historyService";
import { CloneRowCommand } from "@/history/commands/CloneRowCommand";
import { DeleteRowCommand } from "@/history/commands/DeleteRowCommand";

import { ROW_TYPES, type RowEntity } from "@/entities/template";
import { Column } from "@/components/blocks/row/Column";
import { useTranslation } from "react-i18next";
import { SelectionCard } from "@/components/blocks/shared/SelectionCard";
import {
  CloneAction,
  DeleteAction,
  MoveAction,
} from "@/components/blocks/shared/SelectionCardActions";
import { MoveRowCommand } from "@/history/commands/MoveRowCommand";
import { Draggable } from "@/dnd/adapter/components/Draggable";
import type { DndState } from "@/dnd/core/types";
import { DropIndicator } from "@/dnd/adapter/components/DropIndicator";

export const Row: React.FC<{ row: RowEntity }> = ({ row }) => {
  const { t } = useTranslation();
  const viewMode = useUIStore((state) => state.viewMode);
  const template = useEditorStore((state) => state.template);
  const setTemplate = useEditorStore((state) => state.setTemplate);
  const getRowCoordinates = useEditorStore((state) => state.getRowCoordinates);

  const isMobileView = viewMode === "mobile";
  const shouldStack = isMobileView && row.isResponsive;

  const handleClone = () => {
    if (!template) return;
    const rowIndex = getRowCoordinates(row.id);
    if (rowIndex === null) return;

    const command = new CloneRowCommand({
      template,
      setTemplate,
      rowIndex,
      type: "row.clone",
    });
    historyService.executeCommand(command);
  };

  const handleDelete = () => {
    if (!template) return;
    const rowIndex = getRowCoordinates(row.id);
    if (rowIndex === null) return;

    const command = new DeleteRowCommand({
      template,
      setTemplate,
      rowIndex,
      type: "row.delete",
    });
    historyService.executeCommand(command);
  };

  const handleMove = (state: DndState) => {
    if (!state.dragged || !state.droppedOn) return;
    const oldIndex = getRowCoordinates(state.dragged.id);
    let newIndex = getRowCoordinates(state.droppedOn.id);
    if (oldIndex === null || newIndex === null) return;

    newIndex += state.isTopHalf ? 0 : 1;

    // Ajustar si estamos moviendo hacia abajo en el mismo contenedor
    if (oldIndex < newIndex) {
      newIndex -= 1;
    }

    if (oldIndex === newIndex) return;

    const command = new MoveRowCommand({
      template,
      setTemplate,
      oldIndex,
      newIndex,
      type: "row.move",
    });
    historyService.executeCommand(command);
  };

  return (
    <Draggable
      id={row.id}
      type={row.type}
      accepts={ROW_TYPES}
      item={row}
      handle={"[data-drag-handle]"}
      onDragEnd={handleMove}
    >
      {({ setNodeRef, overId, isTopHalf, beingDragged }) => (
        <SelectionCard
          ref={setNodeRef}
          id={row.id}
          label={t("row")}
          actions={[
            <MoveAction label={t("move")} />,
            <CloneAction label={t("clone")} onClick={handleClone} />,
            <DeleteAction label={t("delete")} onClick={handleDelete} />,
          ]}
        >
          {overId === row.id && isTopHalf && (
            <DropIndicator label={t("drop_here")} />
          )}
          <table
            width="100%"
            style={{ ...row.style, opacity: beingDragged ? 0.7 : 1 }}
          >
            <tbody>
              <tr>
                {row.columns.map((column, index) => (
                  <Fragment key={column.id}>
                    <td
                      width={shouldStack ? "100%" : `${column.width}%`}
                      style={{
                        verticalAlign: "top",
                        display: shouldStack ? "block" : "table-cell",
                        width: shouldStack ? "100%" : `${column.width}%`,
                      }}
                    >
                      <Column column={column} />
                    </td>

                    {index < row.columns.length - 1 &&
                      row.separatorSize > 0 && (
                        <td
                          style={{
                            minWidth: shouldStack
                              ? "auto"
                              : `${row.separatorSize}px`,
                            minHeight: shouldStack
                              ? "auto"
                              : `${row.separatorSize}px`,
                            display: shouldStack ? "block" : "table-cell",
                            width: shouldStack
                              ? "100%"
                              : `${row.separatorSize}px`,
                          }}
                        >
                          &nbsp;
                        </td>
                      )}
                  </Fragment>
                ))}
              </tr>
            </tbody>
          </table>{" "}
          {overId === row.id && !isTopHalf && (
            <DropIndicator label={t("drop_here")} />
          )}
        </SelectionCard>
      )}
    </Draggable>
  );
};
