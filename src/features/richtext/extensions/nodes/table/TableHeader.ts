import { TableHeader as Original } from "@tiptap/extension-table";
import { tableCellAttributes } from "@/features/richtext/extensions/nodes/table/utils";

export const TableHeader = Original.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...tableCellAttributes,
    };
  },
});
