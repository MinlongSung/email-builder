import type {
  BlockDefinition,
  BlockType,
} from "@/features/models/types";
import { rootDefinition } from "@/features/blocks/layout/root";
import { rowDefinition } from "@/features/blocks/layout/row";
import { columnDefinition } from "@/features/blocks/layout/column";
import { textDefinition } from "@/features/blocks/content/text";
import { buttonDefinition } from "@/features/blocks/content/button";

export const blockRegistry: Record<BlockType, BlockDefinition> = {
  root: rootDefinition,
  row: rowDefinition,
  column: columnDefinition,
  text: textDefinition,
  button: buttonDefinition,
};

