import { Table as Original, type TableOptions } from "@tiptap/extension-table";
import { type EditorState, type Transaction } from "@tiptap/pm/state";
import {
  TableMap,
  addColumnAfter as originalAddColumnAfter,
  addColumnBefore as originalAddColumnBefore,
  deleteColumn as originalDeleteColumn,
  findTable,
  tableEditing,
} from "@tiptap/pm/tables";
import type { DOMOutputSpec } from "@tiptap/pm/model";
import { mergeAttributes, type CommandProps } from "@tiptap/core";

import { columnResizing } from "@/features/richtext/extensions/nodes/table/columnResizing";
import { TableView } from "@/features/richtext/extensions/nodes/table/TableView";
import {
  distributeWidthEvenly,
  getColumnWidths,
  updateAllCellWidths,
} from "@/features/richtext/extensions/nodes/table/utils";

type ProsemirrorCommand = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
) => boolean;

function addColumn(prosemirrorFn: ProsemirrorCommand, cellMinWidth: number) {
  return ({ state, dispatch }: CommandProps) => {
    const table = findTable(state.selection.$from);
    if (!table) return false;

    const newWidths = distributeWidthEvenly(
      getColumnWidths(table.node).length,
      cellMinWidth,
    );
    if (!newWidths) return false;

    return prosemirrorFn(state, (tr) => {
      const newTable = findTable(tr.selection.$anchor);
      if (newTable)
        updateAllCellWidths(tr, newTable.pos, newTable.node, newWidths);
      dispatch?.(tr);
    });
  };
}

export const Table = Original.extend<
  Pick<
    TableOptions,
    | "handleWidth"
    | "cellMinWidth"
    | "allowTableNodeSelection"
    | "HTMLAttributes"
  >
>({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {},
      handleWidth: 5,
      cellMinWidth: 5,
      allowTableNodeSelection: false,
    };
  },

  renderHTML({ HTMLAttributes }) {
    const table: DOMOutputSpec = [
      "table",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ["tbody", 0],
    ];

    return table;
  },

  addNodeView() {
    return ({ node }) => new TableView(node);
  },

  addCommands() {
    return {
      ...this.parent?.(),

      addColumnBefore: () =>
        addColumn(originalAddColumnBefore, this.options.cellMinWidth),
      addColumnAfter: () =>
        addColumn(originalAddColumnAfter, this.options.cellMinWidth),

      deleteColumn:
        () =>
        ({ state, dispatch }) => {
          const table = findTable(state.selection.$from);
          if (!table) return false;

          return originalDeleteColumn(state, (tr) => {
            const newTable = findTable(tr.selection.$anchor);
            if (newTable) {
              const newCount = TableMap.get(newTable.node).width;
              if (newCount > 0) {
                const newWidths = Array<number>(newCount).fill(100 / newCount);
                updateAllCellWidths(tr, newTable.pos, newTable.node, newWidths);
              }
            }
            dispatch?.(tr);
          });
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      columnResizing({
        handleWidth: this.options.handleWidth,
        cellMinWidth: this.options.cellMinWidth,
      }),
      tableEditing({
        allowTableNodeSelection: this.options.allowTableNodeSelection,
      }),
    ];
  },
});
