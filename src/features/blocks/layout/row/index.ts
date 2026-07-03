import {
  type BlockDefinition,
  type RowBlock,
} from "@/features/models/types";
import { RowRender } from "@/features/blocks/layout/row/RowRender";

export const rowDefinition: BlockDefinition<RowBlock> = {
  type: "row",
  accepts: ["column"],
  isDraggable: true,
  isSelectable: true,
  isHoverable: true,
  Render: RowRender,
};
