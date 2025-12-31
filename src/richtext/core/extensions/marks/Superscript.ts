import type { Extension } from "@/richtext/core/types";
import { toggleMark } from "prosemirror-commands";
import { markInputRule } from "@/richtext/core/inputRules/markInputRule";
import { markPasteRule } from "@/richtext/core/inputRules/pasteRules";

declare module "@/richtext/core/types" {
  interface Commands<ReturnType> {
    superscript: {
      toggleSuperscript: () => ReturnType;
    };
  }
}

// Input rule: Triggers when user types ^text^ followed by space or punctuation
// Example: "E=mc^2^ " → "E=mc² " (with superscript applied)
const superscriptInputRegex = /(?:^|\s)(\^([^^]+)\^)$/;

// Paste rule: Matches ^text^ patterns in pasted content (global flag for multiple matches)
// Example: pasting "x^2^ + y^3^" → applies superscript to both exponents
const superscriptPasteRegex = /\^([^^]+)\^/g;

export const Superscript: Extension<"superscript"> = {
  name: "superscript",
  marks: {
    superscript: {
      excludes: "subscript",
      parseDOM: [
        { tag: "sup" },
        {
          style: "vertical-align",
          getAttrs: (value) => value === "super" && null,
        },
      ],
      toDOM: () => ["sup", { style: "vertical-align: super;" }, 0],
    },
  },

  commands: () => ({
    toggleSuperscript:
      () =>
      ({ state, dispatch }) => {
        const markType = state.schema.marks.superscript;
        if (!markType) return false;
        return toggleMark(markType)(state, dispatch);
      },
  }),
  inputRules: ({ schema }) => {
    const superscriptMark = schema.marks.superscript;
    if (!superscriptMark) return [];

    return [
      markInputRule({
        find: superscriptInputRegex,
        type: superscriptMark,
      }),
    ];
  },
  pasteRules: ({ schema }) => {
    const superscriptMark = schema.marks.superscript;
    if (!superscriptMark) return [];

    return [
      markPasteRule({
        find: superscriptPasteRegex,
        type: superscriptMark,
      }),
    ];
  },
};
