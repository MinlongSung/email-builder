import { OrderedList as Original } from "@tiptap/extension-list";
import { listStyleAttr } from "@/features/richtext/extensions/nodes/list/utils";

export const OrderedList = Original.extend({
  addAttributes() {
    return { ...this.parent?.(), ...listStyleAttr };
  },
});
