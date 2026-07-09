import type { BlockTree } from "@/features/models/types";

import { getBlockOrThrow } from "@/features/document/core/queries";

export function getChildIndex(document: BlockTree, blockId: string): number {
  const block = getBlockOrThrow(document, blockId);

  if (!block.parentId) {
    throw new Error(`Block "${blockId}" has no parent.`);
  }
  
  const parent = getBlockOrThrow(document, block.parentId);

  const index = parent.childrenIds.indexOf(blockId);

  if (index === -1) {
    throw new Error(`Block "${blockId}" is not a child of "${parent.id}".`);
  }

  return index;
}
