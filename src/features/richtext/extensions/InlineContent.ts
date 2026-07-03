import { Node, mergeAttributes } from "@tiptap/core";
import { HardBreak } from "@tiptap/extension-hard-break";

export const InlineContent = Node.create({
  name: "inlineContent",
  group: "block",
  content: "inline*",
  defining: true,
  addExtensions() {
    return [HardBreak];
  },
  parseHTML() {
    return [
      {
        tag: "span",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, {
        ...HTMLAttributes,
      }),
      0,
    ];
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        return editor.commands.setHardBreak();
      },

      "Shift-Enter": ({ editor }) => {
        return editor.commands.setHardBreak();
      },
    };
  },
});
