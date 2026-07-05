import type { Block, BlockTree } from "@/features/models/types";

export function getRoot(
  document: BlockTree,
): Block | undefined {
  return document.blocks[document.rootIds[0]];
}