import {
  type BlockDefinition,
  type ButtonBlock,
} from "@/features/models/types";
import { ButtonRender } from "@/features/blocks/content/button/ButtonRender";
import { BlockPreview } from "@/features/blocks/shared/BlockPreview";

export const buttonDefinition: BlockDefinition<ButtonBlock> = {
  type: "button",
  accepts: [],
  isDraggable: true,
  isSelectable: true,
  isHoverable: true,
  label: 'button',
  Render: ButtonRender,
  Preview: BlockPreview,
};
