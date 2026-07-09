import type { BlockTree } from "@/features/models/types";

import {
  getBlockOrThrow,
  getChildIndex,
} from "@/features/document/core/queries";

interface ResolveInsertionIndexOptions {
  tree: BlockTree;
  blockId: string;
  parentId: string;
  index: number;
}

export function resolveInsertionIndex({
  tree,
  blockId,
  parentId,
  index,
}: ResolveInsertionIndexOptions): number {
  const block = getBlockOrThrow(tree, blockId);

  if (!block.parentId) {
    return index;
  }

  if (block.parentId !== parentId) {
    return index;
  }

  const currentIndex = getChildIndex(tree, blockId);

  return currentIndex < index ? index - 1 : index;
}
