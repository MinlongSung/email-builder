import { TableCell as Original } from "@tiptap/extension-table";
import { tableCellAttributes } from "@/features/richtext/extensions/nodes/table/utils";

export const TableCell = Original.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...tableCellAttributes,
    };
  },
});
