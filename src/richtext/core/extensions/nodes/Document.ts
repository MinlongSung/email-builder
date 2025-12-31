import type { Extension } from "@/richtext/core/types";

export const Document: Extension = {
  name: "doc",
  nodes: {
    doc: {
      content: "block+",
    },
  },
};
