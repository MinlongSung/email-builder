import type { Extension } from "@/richtext/core/types";

export const Text: Extension = {
  name: "text",
  nodes: {
    text: { group: "inline" },
  },
};
