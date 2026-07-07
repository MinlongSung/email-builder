import {
  type BlockDefinition,
  type RowBlock,
} from "@/features/models/types";
import { RowRender } from "@/features/blocks/layout/row/RowRender";
import { RowPreview } from "@/features/blocks/layout/row/RowPreview";

export const rowDefinition: BlockDefinition<RowBlock> = {
  type: "row",
  accepts: ["column"],
  isDraggable: true,
  isSelectable: true,
  isHoverable: true,
  Render: RowRender,
  Preview: RowPreview
};
