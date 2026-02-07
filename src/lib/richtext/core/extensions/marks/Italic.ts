import { toggleMark } from "prosemirror-commands";
import type { Extension } from "../../types";
import { markInputRule } from "../../inputRules/markInputRule";
import { markPasteRule } from "../../inputRules/pasteRules";

declare module "../../types" {
  interface Commands<ReturnType> {
    italic: {
      toggleItalic: () => ReturnType;
    };
  }
}

// Input rule: Triggers when user types _text_ followed by space or punctuation
// Example: "hello _world_ " → "hello world " (with italic applied)
const italicInputRegex = /(?:^|\s)(_([^_]+)_)$/;

// Paste rule: Matches _text_ patterns in pasted content (global flag for multiple matches)
// Example: pasting "_italic_ text _more italic_" → applies italic to both matches
const italicPasteRegex = /_([^_]+)_/g;

export const Italic: Extension<"italic"> = {
  name: "italic",
  marks: {
    italic: {
      parseDOM: [
        { tag: "i" },
        {
          tag: "em",
        },
        {
          style: "font-style",
          getAttrs: (value) => value === "italic" && null,
        },
      ],
      toDOM: () => ["i", { style: "font-style: italic;" }, 0],
    },
  },
  commands: () => ({
    toggleItalic:
      () =>
      ({ state, dispatch }) => {
        const markType = state.schema.marks.italic;
        if (!markType) return false;
        return toggleMark(markType)(state, dispatch);
      },
  }),
  inputRules: ({ schema }) => {
    const italicMark = schema.marks.italic;
    if (!italicMark) return [];

    return [
      markInputRule({
        find: italicInputRegex,
        type: italicMark,
      }),
    ];
  },
  pasteRules: ({ schema }) => {
    const italicMark = schema.marks.italic;
    if (!italicMark) return [];

    return [
      markPasteRule({
        find: italicPasteRegex,
        type: italicMark,
      }),
    ];
  },
};
