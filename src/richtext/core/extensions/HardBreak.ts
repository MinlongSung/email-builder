import type { Extension } from "@/richtext/core/types";

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
};
