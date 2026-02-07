import { toggleMark } from "prosemirror-commands";
import type { Extension } from "../../types";
import { markInputRule } from "../../inputRules/markInputRule";
import { markPasteRule } from "../../inputRules/pasteRules";

declare module "../../types" {
  interface Commands<ReturnType> {
    underline: {
      toggleUnderline: () => ReturnType;
    };
  }
}

// Input rule: Triggers when user types __text__ followed by space or punctuation
// Example: "hello __world__ " → "hello world " (with underline applied)
const underlineInputRegex = /(?:^|\s)(__([^_]+)__)$/;

// Paste rule: Matches __text__ patterns in pasted content (global flag for multiple matches)
// Example: pasting "__underlined__ text __more underlined__" → applies underline to both matches
const underlinePasteRegex = /__([^_]+)__/g;

export const Underline: Extension<"underline"> = {
  name: "underline",
  marks: {
    underline: {
      parseDOM: [
        { tag: "u" },
        {
          style: "text-decoration",
          getAttrs: (value) => value === "underline" && null,
        },
      ],
      toDOM: () => ["u", { style: "text-decoration: underline;" }, 0],
    },
  },
  commands: () => ({
    toggleUnderline:
      () =>
      ({ state, dispatch }) => {
        const markType = state.schema.marks.underline;
        if (!markType) return false;
        return toggleMark(markType)(state, dispatch);
      },
  }),
  inputRules: ({ schema }) => {
    const underlineMark = schema.marks.underline;
    if (!underlineMark) return [];

    return [
      markInputRule({
        find: underlineInputRegex,
        type: underlineMark,
      }),
    ];
  },
  pasteRules: ({ schema }) => {
    const underlineMark = schema.marks.underline;
    if (!underlineMark) return [];

    return [
      markPasteRule({
        find: underlinePasteRegex,
        type: underlineMark,
      }),
    ];
  },
};
