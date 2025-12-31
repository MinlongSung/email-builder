import { Fragment } from "react";
import { ROW_TYPES, type RowEntity } from "@/entities/template";
import { Column } from "@/components/blocks/row/Column";
import { useTranslation } from "react-i18next";
import { SelectionCard } from "@/components/blocks/shared/SelectionCard";
import {
  CloneAction,
  DeleteAction,
  MoveAction,
} from "@/components/blocks/shared/SelectionCardActions";
import { Draggable } from "@/dnd/adapter/components/Draggable";
import { DropIndicator } from "@/dnd/adapter/components/DropIndicator";
import { useRow } from "@/components/blocks/row/hooks/useRow";

export const Row: React.FC<{ row: RowEntity }> = ({ row }) => {
  const { t } = useTranslation();
  const { shouldStack, cloneRow, deleteRow, moveRow } = useRow(row);

  return (
    <Draggable
      id={row.id}
      type={row.type}
      accepts={ROW_TYPES}
      item={row}
      handle={"[data-drag-handle]"}
      onDragEnd={moveRow}
    >
      {({ setNodeRef, overId, isTopHalf, beingDragged }) => (
        <SelectionCard
          ref={setNodeRef}
          id={row.id}
          label={t("row")}
          actions={[
            <MoveAction label={t("move")} />,
            <CloneAction label={t("clone")} onClick={cloneRow} />,
            <DeleteAction label={t("delete")} onClick={deleteRow} />,
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
