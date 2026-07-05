import type { ColumnBlock } from "@/features/models/types";
import { generateId } from "@/features/utils/generateId";

export function createColumnBlock(
  props: Partial<ColumnBlock["props"]> = {},
): ColumnBlock {
  return {
    id: generateId(),

    type: "column",

    parentId: null,

    childrenIds: [],

    props: {
      layout: {
        width: "100%",
      },

      style: {},

      ...props,
    },
  };
}
