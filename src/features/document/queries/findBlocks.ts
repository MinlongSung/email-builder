import type { Block, BlockTree } from "@/features/models/types";

export function findBlocks(
  document: BlockTree,
  predicate: (block: Block) => boolean,
): Block[] {
  return Object.values(document.blocks).filter(predicate);
}