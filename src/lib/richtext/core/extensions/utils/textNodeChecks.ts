import type { Node } from "prosemirror-model";

export const isParagraph = (node?: Node) => node?.type.name === "paragraph";
export const isHeading = (node?: Node): boolean =>
  node?.type.name === "heading";

export const isParagraphOrHeading = (node: Node) =>
  isParagraph(node) || isHeading(node);

export const isHeadingLevel = (
  node: Node | undefined,
  level?: number
): boolean => {
  if (!isHeading(node)) return false;
  return node?.attrs.level === level;
};
