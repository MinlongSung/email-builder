import type { Block, BlockTree } from "@/features/models/types";

export function getBlockById(
  document: BlockTree,
  id: string,
): Block | undefined {
  return document.blocks[id];
}
