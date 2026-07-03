import {
  type BlockDefinition,
  type ButtonBlock,
} from "@/features/models/types";
import { ButtonRender } from "@/features/blocks/content/button/ButtonRender";

export const buttonDefinition: BlockDefinition<ButtonBlock> = {
  type: "button",
  accepts: [],
  isDraggable: true,
  isSelectable: true,
  isHoverable: true,
  Render: ButtonRender,
};
