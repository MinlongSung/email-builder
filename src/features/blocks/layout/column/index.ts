import {
  type BlockDefinition,
  type ColumnBlock,
} from "@/features/models/types";
import { ColumnRender } from "@/features/blocks/layout/column/ColumnRender";

export const columnDefinition: BlockDefinition<ColumnBlock> = {
  type: "column",
  accepts: ["text", "button"],
  isDraggable: false,
  isSelectable: false,
  isHoverable: false,
  Render: ColumnRender,
};
