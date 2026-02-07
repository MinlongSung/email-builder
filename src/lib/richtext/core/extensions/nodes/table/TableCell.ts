import type { Extension } from "../../../types";
import { getCellAttrs } from "../../../extensions/nodes/table/utils/getCellAttrs";
import { setCellAttrs } from "../../../extensions/nodes/table/utils/setCellAttrs";
import type { CellAttrs } from "../../../extensions/nodes/table/types";

export const TableCell: Extension = {
  name: "tableCell",
  nodes: {
    tableCell: {
      content: "block+",
      tableRole: "cell",
      isolating: true,
      attrs: {
        colspan: { default: 1 },
        rowspan: { default: 1 },
        colwidth: { default: null },
        backgroundColor: { default: null },
        border: {
          default: {
            width: "1px",
            style: "solid",
            color: "#000000",
          },
        },
      },
      parseDOM: [
        {
          tag: "td",
          getAttrs: (dom) => getCellAttrs(dom),
        },
      ],
      toDOM(node) {
        return ["td", setCellAttrs(node as unknown as { attrs: CellAttrs }), 0];
      },
    },
  },
};
