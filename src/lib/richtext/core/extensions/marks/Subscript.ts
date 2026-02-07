import { toggleMark } from "prosemirror-commands";
import type { Extension } from "../../types";
import { markInputRule } from "../../inputRules/markInputRule";
import { markPasteRule } from "../../inputRules/pasteRules";

declare module "../../types" {
  interface Commands<ReturnType> {
    subscript: {
      toggleSubscript: () => ReturnType;
    };
  }
}

// Input rule: Triggers when user types ~text~ followed by space or punctuation
// Example: "H~2~O " → "H₂O " (with subscript applied)
const subscriptInputRegex = /(?:^|\s)(~([^~]+)~)$/;

// Paste rule: Matches ~text~ patterns in pasted content (global flag for multiple matches)
// Example: pasting "H~2~O and CO~2~" → applies subscript to both chemical formulas
const subscriptPasteRegex = /~([^~]+)~/g;

export const Subscript: Extension<"subscript"> = {
  name: "subscript",
  marks: {
    subscript: {
      excludes: "superscript",
      parseDOM: [
        { tag: "sub" },
        {
          style: "vertical-align",
          getAttrs: (value) => value === "sub" && null,
        },
      ],
      toDOM: () => ["sub", { style: "vertical-align: sub;" }, 0],
    },
  },
  commands: () => ({
    toggleSubscript:
      () =>
      ({ state, dispatch }) => {
        const markType = state.schema.marks.subscript;
        if (!markType) return false;
        return toggleMark(markType)(state, dispatch);
      },
  }),
  inputRules: ({ schema }) => {
    const subscriptMark = schema.marks.subscript;
    if (!subscriptMark) return [];

    return [
      markInputRule({
        find: subscriptInputRegex,
        type: subscriptMark,
      }),
    ];
  },
  pasteRules: ({ schema }) => {
    const subscriptMark = schema.marks.subscript;
    if (!subscriptMark) return [];

    return [
      markPasteRule({
        find: subscriptPasteRegex,
        type: subscriptMark,
      }),
    ];
  },
};
