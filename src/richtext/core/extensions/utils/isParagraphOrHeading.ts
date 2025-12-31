import type { Node } from "prosemirror-model";

export const isParagraphOrHeading = (node: Node) =>
  node.type.name === "paragraph" || node.type.name === "heading";
