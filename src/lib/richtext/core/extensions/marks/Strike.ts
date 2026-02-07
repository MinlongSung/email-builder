import { toggleMark } from "prosemirror-commands";
import type { Extension } from "../../types";
import { markInputRule } from "../../inputRules/markInputRule";
import { markPasteRule } from "../../inputRules/pasteRules";

declare module "../../types" {
  interface Commands<ReturnType> {
    strike: {
      toggleStrike: () => ReturnType;
    };
  }
}

// Input rule: Triggers when user types ~~text~~ followed by space or punctuation
// Example: "hello ~~world~~ " → "hello world " (with strikethrough applied)
const strikeInputRegex = /(?:^|\s)(~~([^~]+)~~)$/;

// Paste rule: Matches ~~text~~ patterns in pasted content (global flag for multiple matches)
// Example: pasting "~~deleted~~ text ~~more deleted~~" → applies strikethrough to both matches
const strikePasteRegex = /~~([^~]+)~~/g;

export const Strike: Extension<"strike"> = {
  name: "strike",
  marks: {
    strike: {
      parseDOM: [
        { tag: "s" },
        { tag: "strike" },
        { tag: "del" },
        {
          style: "text-decoration",
          getAttrs: (value) => value === "line-through" && null,
        },
      ],
      toDOM: () => ["s", { style: "text-decoration: line-through;" }, 0],
    },
  },
  commands: () => ({
    toggleStrike:
      () =>
      ({ state, dispatch }) => {
        const markType = state.schema.marks.strike;
        if (!markType) return false;
        return toggleMark(markType)(state, dispatch);
      },
  }),
  inputRules: ({ schema }) => {
    const strikeMark = schema.marks.strike;
    if (!strikeMark) return [];

    return [
      markInputRule({
        find: strikeInputRegex,
        type: strikeMark,
      }),
    ];
  },
  pasteRules: ({ schema }) => {
    const strikeMark = schema.marks.strike;
    if (!strikeMark) return [];

    return [
      markPasteRule({
        find: strikePasteRegex,
        type: strikeMark,
      }),
    ];
  },
};
