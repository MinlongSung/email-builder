import type { Extension } from "@/richtext/core/types";

export const Document = (config?: { content: string }): Extension => ({
  name: "doc",
  nodes: {
    doc: {
      content: config?.content ?? "block+",
    },
  },
});
