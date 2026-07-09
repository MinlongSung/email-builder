import type { BlockTree } from "@/features/models/types";

import { getBlockById, getChildIndex } from "@/features/document/core/queries";

interface CheckIsSamePositionOptions {
  tree: BlockTree;
  blockId: string;
  parentId: string;
  index: number;
}

export function checkIsSamePosition({
  tree,
  blockId,
  parentId,
  index,
}: CheckIsSamePositionOptions): boolean {
  const block = getBlockById(tree, blockId);

  if (!block || block.parentId !== parentId) {
    return false;
  }

  return getChildIndex(tree, blockId) === index;
}