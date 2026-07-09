import type { Block, BlockTree } from "@/features/models/types";

export function findFirstBlock(
  document: BlockTree,
  predicate: (block: Block) => boolean,
): Block | undefined {
  return Object.values(document.blocks).find(predicate);
}