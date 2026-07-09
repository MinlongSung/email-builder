import type { BlockTree } from "@/features/models/types";

import { getBlockById } from "@/features/document/core/queries";

export function getChildIndex(document: BlockTree, blockId: string): number {
  const block = getBlockById(document, blockId);

  if (!block) throw new Error(`Block "${blockId}" not found.`);

  if (!block.parentId) throw new Error(`Block "${blockId}" has no parent.`);

  const parent = getBlockById(document, block.parentId);

  if (!parent) throw new Error(`Parent "${block.parentId}" not found.`);

  const index = parent.childrenIds.indexOf(blockId);

  if (index === -1) {
    throw new Error(`Block "${blockId}" is not a child of "${parent.id}".`);
  }

  return index;
}
