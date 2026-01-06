import { useCallback, useState } from "react";
import type { RowEntity, ColumnEntity } from "@/entities/template";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { UpdateRowCommand } from "@/commands/rows/UpdateRowCommand";
import { historyService } from "@/history/services/historyService";
import { generateId } from "@/utils/generateId";
import { SpacingControl } from "@/components/shared/SpacingControl";

const MIN_WIDTH = 5;

export const RowPanel = ({ row }: { row: RowEntity }) => {
  const getTemplate = useCanvasStore((store) => store.getTemplate);
  const setTemplate = useCanvasStore((store) => store.setTemplate);
  const getRowCoordinates = useCanvasStore((store) => store.getRowCoordinates);

  // Track which columns are frozen (locked)
  const [frozenColumns, setFrozenColumns] = useState<Set<string>>(new Set());

  const rowIndex = getRowCoordinates(row.id);
  const totalColumns = row.columns.length;
  const maxWidth = 100 - (totalColumns - 1) * MIN_WIDTH;

  // Get the column with most width that isn't frozen
  const getTargetColumnIndex = (excludeIndex?: number): number | null => {
    let maxWidth = -1;
    let targetIndex: number | null = null;

    row.columns.forEach((col, idx) => {
      if (
        idx !== excludeIndex &&
        !frozenColumns.has(col.id) &&
        col.width > maxWidth
      ) {
        maxWidth = col.width;
        targetIndex = idx;
      }
    });

    return targetIndex;
  };

  // Check if a column can be modified
  const canModifyColumn = (columnIndex: number): boolean => {
    // Can't modify if only one column
    if (totalColumns === 1) return false;

    const columnId = row.columns[columnIndex].id;
    const isFrozen = frozenColumns.has(columnId);

    // If frozen, can't modify
    if (isFrozen) return false;

    // Check if there's at least one other unfrozen column to transfer width to/from
    const hasTransferTarget = getTargetColumnIndex(columnIndex) !== null;
    return hasTransferTarget;
  };

  // Check if we can add a new column
  const canAddColumn = (): boolean => {
    // Need at least MIN_WIDTH% available
    // Check if there are unfrozen columns with more than MIN_WIDTH
    let availableWidth = 0;

    row.columns.forEach((col) => {
      if (!frozenColumns.has(col.id)) {
        const extraWidth = col.width - MIN_WIDTH;
        if (extraWidth > 0) {
          availableWidth += extraWidth;
        }
      }
    });

    // Need at least MIN_WIDTH to create a new column
    return availableWidth >= MIN_WIDTH;
  };

  const executeUpdate = useCallback(
    (newColumns: ColumnEntity[]) => {
      if (rowIndex === null) return;
      const command = new UpdateRowCommand({
        rowIndex,
        getTemplate,
        setTemplate,
        updates: { columns: newColumns },
      });

      historyService.executeCommand(command, {
        id: generateId(),
        type: "row.update",
        timestamp: Date.now(),
      });
    },
    [rowIndex, getTemplate, setTemplate]
  );

  if (rowIndex === null) return null;

  const handleAddColumn = () => {
    // Calculate unfrozen columns
    const unfrozenColumns = row.columns.filter(
      (col) => !frozenColumns.has(col.id)
    );
    const frozenColumnsList = row.columns.filter((col) =>
      frozenColumns.has(col.id)
    );

    // Calculate total width of frozen columns
    const frozenWidth = frozenColumnsList.reduce(
      (sum, col) => sum + col.width,
      0
    );

    // Available width for unfrozen columns + new column
    const availableWidth = 100 - frozenWidth;
    const newColumnCount = unfrozenColumns.length + 1;
    const newWidth = Math.floor(availableWidth / newColumnCount);
    const remainder = availableWidth - newWidth * newColumnCount;

    // Build new columns array
    const newColumns: ColumnEntity[] = [];
    let remainderApplied = false;

    row.columns.forEach((col) => {
      if (frozenColumns.has(col.id)) {
        // Keep frozen columns unchanged
        newColumns.push(col);
      } else {
        // Redistribute unfrozen columns
        newColumns.push({
          ...col,
          width: newWidth + (!remainderApplied ? remainder : 0),
        });
        remainderApplied = true;
      }
    });

    // Add new column
    newColumns.push({
      id: generateId(),
      width: newWidth,
      blocks: [],
    });

    executeUpdate(newColumns);
  };

  const handleDeleteColumn = (columnIndex: number) => {
    if (totalColumns <= 1) return;

    const deletedColumn = row.columns[columnIndex];
    const deletedWidth = deletedColumn.width;
    const remainingColumns = row.columns.filter((_, idx) => idx !== columnIndex);

    // Only distribute to unfrozen columns
    const unfrozenColumns = remainingColumns.filter(
      (col) => !frozenColumns.has(col.id)
    );

    if (unfrozenColumns.length === 0) {
      // No unfrozen columns to distribute to, can't delete
      return;
    }

    // Distribute deleted width evenly among unfrozen columns
    const widthPerColumn = Math.floor(deletedWidth / unfrozenColumns.length);
    const remainder = deletedWidth - widthPerColumn * unfrozenColumns.length;

    let remainderApplied = false;
    const updatedColumns = remainingColumns.map((col) => {
      if (frozenColumns.has(col.id)) {
        // Keep frozen columns unchanged
        return col;
      } else {
        // Distribute to unfrozen columns
        const extraWidth = widthPerColumn + (!remainderApplied ? remainder : 0);
        remainderApplied = true;
        return {
          ...col,
          width: col.width + extraWidth,
        };
      }
    });

    // Remove from frozen set
    setFrozenColumns((prev) => {
      const newSet = new Set(prev);
      newSet.delete(deletedColumn.id);
      return newSet;
    });

    executeUpdate(updatedColumns);
  };

  const handleToggleFreeze = (columnId: string) => {
    setFrozenColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  const handleWidthChange = (columnIndex: number, delta: number) => {
    const column = row.columns[columnIndex];
    const newWidth = Math.max(
      MIN_WIDTH,
      Math.min(maxWidth, column.width + delta)
    );

    if (newWidth === column.width) return;

    const actualDelta = newWidth - column.width;
    const targetIndex = getTargetColumnIndex(columnIndex);

    if (targetIndex === null) return;

    const targetColumn = row.columns[targetIndex];
    const newTargetWidth = targetColumn.width - actualDelta;

    if (newTargetWidth < MIN_WIDTH) return;

    const newColumns = row.columns.map((col, idx) => {
      if (idx === columnIndex) return { ...col, width: newWidth };
      if (idx === targetIndex) return { ...col, width: newTargetWidth };
      return col;
    });

    executeUpdate(newColumns);
  };

  const handleWidthInputChange = (columnIndex: number, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    const clampedValue = Math.max(MIN_WIDTH, Math.min(maxWidth, numValue));
    const delta = clampedValue - row.columns[columnIndex].width;

    if (delta !== 0) {
      handleWidthChange(columnIndex, delta);
    }
  };

  const handleSeparatorChange = (delta: number) => {
    const newSize = Math.max(0, row.separatorSize + delta);
    executeUpdate([...row.columns]);

    const command = new UpdateRowCommand({
      rowIndex: rowIndex!,
      getTemplate,
      setTemplate,
      updates: { separatorSize: newSize },
    });

    historyService.executeCommand(command, {
      id: generateId(),
      type: "row.update",
      timestamp: Date.now(),
    });
  };

  const handleSeparatorInputChange = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    const clampedValue = Math.max(0, numValue);

    const command = new UpdateRowCommand({
      rowIndex: rowIndex!,
      getTemplate,
      setTemplate,
      updates: { separatorSize: clampedValue },
    });

    historyService.executeCommand(command, {
      id: generateId(),
      type: "row.update",
      timestamp: Date.now(),
    });
  };

  const handleResponsiveChange = (isResponsive: boolean) => {
    const command = new UpdateRowCommand({
      rowIndex: rowIndex!,
      getTemplate,
      setTemplate,
      updates: { isResponsive },
    });

    historyService.executeCommand(command, {
      id: generateId(),
      type: "row.update",
      timestamp: Date.now(),
    });
  };

  const handlePaddingChange = (padding: string) => {
    const command = new UpdateRowCommand({
      rowIndex: rowIndex!,
      getTemplate,
      setTemplate,
      updates: {
        style: {
          ...row.style,
          padding,
        },
      },
    });

    historyService.executeCommand(command, {
      id: generateId(),
      type: "row.update",
      timestamp: Date.now(),
    });
  };

  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>
        Row Columns ({totalColumns})
      </h3>

      <button
        onClick={handleAddColumn}
        disabled={!canAddColumn()}
        style={{
          padding: "8px",
          cursor: canAddColumn() ? "pointer" : "not-allowed",
          opacity: canAddColumn() ? 1 : 0.5,
        }}
        title={
          !canAddColumn()
            ? "No space available (all columns at minimum or frozen)"
            : "Add new column"
        }
      >
        + Add Column
      </button>

      {/* Separator Size Control */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: "bold" }}>
          Separator:
        </span>

        <button
          onClick={() => handleSeparatorChange(-1)}
          style={{
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          -
        </button>

        <input
          type="number"
          value={row.separatorSize}
          onChange={(e) => handleSeparatorInputChange(e.target.value)}
          min={0}
          style={{
            width: "60px",
            padding: "4px",
            textAlign: "center",
          }}
        />

        <span style={{ fontSize: "12px" }}>px</span>

        <button
          onClick={() => handleSeparatorChange(1)}
          style={{
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>

      {/* Responsive Checkbox */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <label
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={row.isResponsive}
            onChange={(e) => handleResponsiveChange(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          Responsive (stack on mobile)
        </label>
      </div>

      {/* Padding Control */}
      <SpacingControl
        value={row.style?.padding as string}
        onChange={handlePaddingChange}
        label="Row Padding"
        type="padding"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {row.columns.map((column, idx) => {
          const isFrozen = frozenColumns.has(column.id);
          const canDelete = totalColumns > 1;
          const canModify = canModifyColumn(idx);
          const canFreeze = totalColumns > 1; // Can only freeze if there's more than 1 column

          return (
            <div
              key={column.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: !canModify && !isFrozen ? "#f5f5f5" : "white",
              }}
            >
              <span style={{ fontSize: "12px", minWidth: "20px" }}>
                {idx + 1}
              </span>

              <button
                onClick={() => handleToggleFreeze(column.id)}
                disabled={!canFreeze}
                style={{
                  padding: "4px 8px",
                  cursor: canFreeze ? "pointer" : "not-allowed",
                  backgroundColor: isFrozen ? "#ffeb3b" : "#fff",
                  border: "1px solid #ccc",
                  opacity: canFreeze ? 1 : 0.5,
                }}
                title={
                  !canFreeze
                    ? "Cannot freeze single column"
                    : isFrozen
                    ? "Unfreeze"
                    : "Freeze"
                }
              >
                {isFrozen ? "🔒" : "🔓"}
              </button>

              <button
                onClick={() => handleWidthChange(idx, -1)}
                disabled={!canModify}
                style={{
                  padding: "4px 8px",
                  cursor: canModify ? "pointer" : "not-allowed",
                  opacity: canModify ? 1 : 0.5,
                }}
                title={
                  !canModify
                    ? totalColumns === 1
                      ? "Cannot modify single column"
                      : "No available columns to transfer width"
                    : "Decrease width"
                }
              >
                -
              </button>

              <input
                type="number"
                value={column.width}
                onChange={(e) => handleWidthInputChange(idx, e.target.value)}
                disabled={!canModify}
                min={MIN_WIDTH}
                max={maxWidth}
                style={{
                  width: "60px",
                  padding: "4px",
                  textAlign: "center",
                  opacity: canModify ? 1 : 0.5,
                  cursor: canModify ? "text" : "not-allowed",
                }}
                title={
                  !canModify
                    ? totalColumns === 1
                      ? "Cannot modify single column"
                      : "No available columns to transfer width"
                    : `Width (${MIN_WIDTH}-${maxWidth}%)`
                }
              />

              <span style={{ fontSize: "12px" }}>%</span>

              <button
                onClick={() => handleWidthChange(idx, 1)}
                disabled={!canModify}
                style={{
                  padding: "4px 8px",
                  cursor: canModify ? "pointer" : "not-allowed",
                  opacity: canModify ? 1 : 0.5,
                }}
                title={
                  !canModify
                    ? totalColumns === 1
                      ? "Cannot modify single column"
                      : "No available columns to transfer width"
                    : "Increase width"
                }
              >
                +
              </button>

              <button
                onClick={() => handleDeleteColumn(idx)}
                disabled={!canDelete}
                style={{
                  padding: "4px 8px",
                  cursor: canDelete ? "pointer" : "not-allowed",
                  opacity: canDelete ? 1 : 0.5,
                  color: "red",
                  marginLeft: "auto",
                }}
                title={!canDelete ? "Cannot delete last column" : "Delete column"}
              >
                🗑
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
        Total: {row.columns.reduce((sum, col) => sum + col.width, 0)}%
        <br />
        Min per column: {MIN_WIDTH}%
        <br />
        Max per column: {maxWidth}%
      </div>
    </div>
  );
};
