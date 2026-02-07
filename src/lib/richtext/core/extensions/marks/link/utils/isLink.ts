import type { Mark } from "prosemirror-model";

export const isLink = (mark?: Mark) => mark?.type.name === "link";
