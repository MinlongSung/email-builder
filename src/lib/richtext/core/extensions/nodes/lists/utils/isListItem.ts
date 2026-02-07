import type { Node } from "prosemirror-model";

export const isListItem = (node?: Node) => node?.type.name === "listItem";
