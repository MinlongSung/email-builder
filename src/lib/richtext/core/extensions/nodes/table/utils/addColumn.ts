import {
  addColumnBefore as originalAddColumnBefore,
  addColumnAfter as originalAddColumnAfter,
  findTable,
} from "prosemirror-tables";
import type { EditorState, Transaction } from "prosemirror-state";
import { DEFAULT_MIN_COLUMN_WIDTH_PERCENT } from "../plugins/columnResizing";
import { getColumnWidths } from "./getColumnWidths";
import { distributeWidthEvenly } from "./distributeWidthEvenly";
import { updateAllCellWidths } from "./updateAllCellWidths";

const addColumn = (
  minWidth: number,
  originalCommand: (
    state: EditorState,
    dispatch?: (tr: Transaction) => void
  ) => boolean
) => {
  return (
    state: EditorState,
    dispatch?: (tr: Transaction) => void
  ): boolean => {
    const table = findTable(state.selection.$from);
    if (!table) return false;

    const currentWidths = getColumnWidths(table.node);
    const newWidths = distributeWidthEvenly(currentWidths, minWidth);

    if (!newWidths) {
      console.warn(
        `Cannot add column: max ${Math.floor(
          100 / minWidth
        )} columns at ${minWidth}% minimum`
      );
      return false;
    }

    return originalCommand(state, (tr) => {
      const newTable = findTable(tr.selection.$anchor);
      if (newTable) {
        updateAllCellWidths(tr, newTable.pos, newTable.node, newWidths);
      }

      dispatch?.(tr);
    });
  };
};

export const addColumnBefore =
  (minWidth = DEFAULT_MIN_COLUMN_WIDTH_PERCENT) =>
  (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    return addColumn(minWidth, originalAddColumnBefore)(state, dispatch);
  };

export const addColumnAfter =
  (minWidth = DEFAULT_MIN_COLUMN_WIDTH_PERCENT) =>
  (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    return addColumn(minWidth, originalAddColumnAfter)(state, dispatch);
  };
