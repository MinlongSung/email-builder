import {
  type BlockDefinition,
  type TextBlock,
} from "@/features/models/types";
import { TextRender } from "@/features/blocks/content/text/TextRender";

export const textDefinition: BlockDefinition<TextBlock> = {
  type: "text",
  accepts: [],
  isDraggable: true,
  isSelectable: true,
  isHoverable: true,
  Render: TextRender,
};
