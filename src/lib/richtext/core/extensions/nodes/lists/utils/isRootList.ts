import type { Node, ResolvedPos } from "prosemirror-model";

export const isRootList = (node: Node, pos: ResolvedPos) => {
  if (!["bulletList", "orderedList"].includes(node.type.name)) return false;
  return pos.depth === 1;
};
