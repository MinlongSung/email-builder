import type { Node } from "prosemirror-model";

export const isList = (node: Node) => {
  return node.type.name === "bulletList" || node.type.name === "orderedList";
};
