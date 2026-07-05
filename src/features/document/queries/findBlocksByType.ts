import type { Block, BlockType, BlockTree } from "@/features/models/types";

export function findBlocksByType(
  document: BlockTree,
  type: BlockType,
): Block[] {
  return Object.values(document.blocks).filter((block) => block.type === type);
}
