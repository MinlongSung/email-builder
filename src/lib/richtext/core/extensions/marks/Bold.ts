import { toggleMark } from "prosemirror-commands";
import type { Extension } from "../../types";
import { markInputRule } from "../../inputRules/markInputRule";
import { markPasteRule } from "../../inputRules/pasteRules";

declare module "../../types" {
  interface Commands<ReturnType> {
    bold: {
      toggleBold: () => ReturnType;
    };
  }
}

const fontWeightValueRegex = /^(bold(er)?|[5-9]\d{2,})$/;

// Input rule: Triggers when user types **text** followed by space or punctuation
// Example: "hello **world** " → "hello world " (with bold applied)
const boldInputRegex = /(?:^|\s)(\*\*([^*]+)\*\*)$/;

// Paste rule: Matches **text** patterns in pasted content (global flag for multiple matches)
// Example: pasting "**bold** text **more bold**" → applies bold to both matches
const boldPasteRegex = /\*\*([^*]+)\*\*/g;

export const Bold: Extension<"bold"> = {
  name: "bold",
  marks: {
    bold: {
      parseDOM: [
        { tag: "strong" },
        {
          tag: "b",
          getAttrs: (node) => node.style.fontWeight !== "normal" && null,
        },
        {
          style: "font-weight",
          getAttrs: (value) => fontWeightValueRegex.test(value) && null,
        },
      ],
      toDOM: () => ["b", { style: "font-weight: bold;" }, 0],
    },
  },
  commands: () => ({
    toggleBold:
      () =>
      ({ state, dispatch }) => {
        const markType = state.schema.marks.bold;
        if (!markType) return false;
        return toggleMark(markType)(state, dispatch);
      },
  }),
  inputRules: ({ schema }) => {
    const boldMark = schema.marks.bold;
    if (!boldMark) return [];

    return [
      markInputRule({
        find: boldInputRegex,
        type: boldMark,
      }),
    ];
  },
  pasteRules: ({ schema }) => {
    const boldMark = schema.marks.bold;
    if (!boldMark) return [];

    return [
      markPasteRule({
        find: boldPasteRegex,
        type: boldMark,
      }),
    ];
  },
};
