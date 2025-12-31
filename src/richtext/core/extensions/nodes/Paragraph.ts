import { setBlockType } from "prosemirror-commands";
import type { Extension } from "@/richtext/core/types";

declare module "@/richtext/core/types" {
  interface Commands<ReturnType> {
    paragraph: {
      setParagraph: () => ReturnType;
    };
  }
}

export const Paragraph: Extension<"paragraph"> = {
  name: "paragraph",
  nodes: {
    paragraph: {
      attrs: {},
      content: "inline*",
      group: "block",
      parseDOM: [
        {
          tag: "p",
          getAttrs: () => ({}),
        },
      ],
      toDOM: () => {
        return ["p", {}, 0];
      },
    },
  },

  commands: () => ({
    setParagraph:
      () =>
      ({ state, dispatch }) => {
        const nodeType = state.schema.nodes.paragraph;
        if (!nodeType) return false;
        return setBlockType(nodeType)(state, dispatch);
      },
  }),
};
