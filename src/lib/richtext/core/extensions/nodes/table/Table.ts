import {
  addRowAfter,
  addRowBefore,
  deleteColumn,
  deleteRow,
  deleteTable,
  goToNextCell,
  mergeCells,
  setCellAttr,
  splitCell,
  tableEditing,
  toggleHeaderCell,
} from "prosemirror-tables";
import { keymap } from "prosemirror-keymap";
import { percentageColumnResizing } from "../../../extensions/nodes/table/plugins/columnResizing";
import { cellSelectionPlugin } from "../../../extensions/nodes/table/plugins/cellSelection";
import { tableContextPlugin } from "../../../extensions/nodes/table/plugins/tableContext";
import type { Extension } from "../../../types";
import { TableView } from "../../../extensions/nodes/table/nodeViews/TableView";
import { insertTable } from "../../../extensions/nodes/table/utils/insertTable";
import { addColumnAfter, addColumnBefore } from "../../../extensions/nodes/table/utils/addColumn";

declare module "../../../types" {
  interface Commands<ReturnType> {
    table: {
      insertTable: (options?: { rows?: number; cols?: number }) => ReturnType;
      addRowBefore: () => ReturnType;
      addRowAfter: () => ReturnType;
      deleteRow: () => ReturnType;
      addColumnBefore: (minWidth?: number) => ReturnType;
      addColumnAfter: (minWidth?: number) => ReturnType;
      deleteColumn: () => ReturnType;
      deleteTable: () => ReturnType;
      mergeCells: () => ReturnType;
      splitCell: () => ReturnType;
      setCellAttribute: (name: string, value: unknown) => ReturnType;
      toggleHeaderCell: () => ReturnType;
    };
  }
}

export const Table: Extension<"table"> = {
  name: "table",
  nodes: {
    table: {
      content: "tableRow+",
      tableRole: "table",
      isolating: true,
      group: "block",
      attrs: {
        tableWidth: { default: "100%" },
      },
      parseDOM: [
        {
          tag: "table",
          getAttrs: (dom) => ({
            tableWidth: dom.style.width || dom.getAttribute("width") || "100%",
          }),
        },
      ],
      toDOM: (node) => [
        "table",
        {
          style: `width: ${node.attrs.tableWidth}; table-layout: fixed; border-collapse: collapse; border-spacing: 0;`,
          width: node.attrs.tableWidth.replace("%", "") + "%",
          cellpadding: "0",
          cellspacing: "0",
        },
        ["tbody", 0],
      ],
    },
  },

  nodeViews: () => {
    return { table: (node) => new TableView(node) };
  },

  commands: () => ({
    insertTable:
      ({ rows, cols } = {}) =>
      ({ state, dispatch }) => {
        return insertTable(rows, cols)(state, dispatch);
      },
    addRowBefore:
      () =>
      ({ state, dispatch }) =>
        addRowBefore(state, dispatch),
    addRowAfter:
      () =>
      ({ state, dispatch }) =>
        addRowAfter(state, dispatch),
    deleteRow:
      () =>
      ({ state, dispatch }) =>
        deleteRow(state, dispatch),
    addColumnBefore:
      (minWidth) =>
      ({ state, dispatch }) => {
        return addColumnBefore(minWidth)(state, dispatch);
      },
    addColumnAfter:
      (minWidth) =>
      ({ state, dispatch }) => {
        return addColumnAfter(minWidth)(state, dispatch);
      },
    deleteColumn:
      () =>
      ({ state, dispatch }) =>
        deleteColumn(state, dispatch),
    deleteTable:
      () =>
      ({ state, dispatch }) =>
        deleteTable(state, dispatch),
    mergeCells:
      () =>
      ({ state, dispatch }) =>
        mergeCells(state, dispatch),
    splitCell:
      () =>
      ({ state, dispatch }) =>
        splitCell(state, dispatch),
    setCellAttribute:
      (name, value) =>
      ({ state, dispatch }) => {
        return setCellAttr(name, value)(state, dispatch);
      },
    toggleHeaderCell:
      () =>
      ({ state, dispatch }) =>
        toggleHeaderCell(state, dispatch),
  }),

  plugins: () => [
    tableEditing(),
    percentageColumnResizing(),
    cellSelectionPlugin(),
    tableContextPlugin(),
    keymap({
      Tab: goToNextCell(1),
      "Shift-Tab": goToNextCell(-1),
    }),
  ],
};
