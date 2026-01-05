import type { Extension } from "@/richtext/core/types";
import { getCellAttrs } from "@/richtext/core/extensions/nodes/table/utils/getCellAttrs";
import { setCellAttrs } from "@/richtext/core/extensions/nodes/table/utils/setCellAttrs";
import type { CellAttrs } from "@/richtext/core/extensions/nodes/table/types";

export const TableHeader: Extension = {
  name: "tableHeader",
  nodes: {
    tableHeader: {
      content: "block+",
      tableRole: "header_cell",
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
          tag: "th",
          getAttrs: (dom) => getCellAttrs(dom),
        },
      ],
      toDOM(node) {
        return ["th", setCellAttrs(node as unknown as { attrs: CellAttrs }), 0];
      },
    },
  },
};
