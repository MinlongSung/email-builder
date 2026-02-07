import { keymap } from "prosemirror-keymap";
import type { Extension } from "../types";

export const HardBreak: Extension = {
  name: "hardBreak",
  nodes: {
    hardBreak: {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM: () => ["br"],
    },
  },
  plugins: ({ schema }) => [
    keymap({
      Enter: (state, dispatch) => {
        const hardBreak = schema.nodes.hardBreak;
        if (!hardBreak) return false;

        if (dispatch) {
          dispatch(
            state.tr.replaceSelectionWith(hardBreak.create()).scrollIntoView()
          );
        }
        return true;
      },
    }),
  ],
};
