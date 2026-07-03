import {
  type BlockDefinition,
  type RootBlock,
} from "@/features/models/types";
import { RootRender } from "@/features/blocks/layout/root/RootRender";

export const rootDefinition: BlockDefinition<RootBlock> = {
  type: "root",
  accepts: ["row"],
  isDraggable: false,
  isSelectable: true,
  isHoverable: true,
  Render: RootRender,
};
