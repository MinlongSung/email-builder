import type { Extension } from "../../../types";

export const TableRow: Extension = {
  name: "tableRow",
  nodes: {
    tableRow: {
      content: "(tableCell | tableHeader)*",
      tableRole: "row",
      parseDOM: [{ tag: "tr" }],
      toDOM() {
        return ["tr", 0];
      },
    },
  },
};
