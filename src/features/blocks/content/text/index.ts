import { type BlockDefinition, type TextBlock } from "@/features/models/types";
import { TextRender } from "@/features/blocks/content/text/TextRender";
import { BlockPreview } from "@/features/blocks/shared/BlockPreview";

export const textDefinition: BlockDefinition<TextBlock> = {
  type: "text",
  accepts: [],
  isDraggable: true,
  isSelectable: true,
  isHoverable: true,
  label: 'text',
  Render: TextRender,
  Preview: BlockPreview,
};
