import type { RowBlock } from "@/features/models/types";
import { generateId } from "@/features/utils/generateId";

export function createRowBlock(
  props: Partial<RowBlock["props"]> = {},
): RowBlock {
  return {
    id: generateId(),

    type: "row",

    parentId: null,

    childrenIds: [],

    props: {
      isResponsive: true,

      layout: {
        padding: {
          top: "20px",
          right: "20px",
          bottom: "0px",
          left: "20px",
        },
        gap: "10px"
      },

      style: {},

      ...props,
    },
  };
}
