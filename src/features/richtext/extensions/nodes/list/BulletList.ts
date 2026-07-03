import { BulletList as Original } from "@tiptap/extension-list";
import { listStyleAttr } from "@/features/richtext/extensions/nodes/list/utils";

export const BulletList = Original.extend({
  addAttributes() {
    return { ...this.parent?.(), ...listStyleAttr };
  },
});
