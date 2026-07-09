import type { BlockTree } from "@/features/models/types";

import {
  getChildIndex,
  getBlockOrThrow,
} from "@/features/document/core/queries";

export function getTreePositions(tree: BlockTree, ids: string[]) {
  return ids.map((id) => {
    const block = getBlockOrThrow(tree, id);

    if (!block.parentId) {
      throw new Error(`Block "${id}" has no parent.`);
    }

    return {
      id,
      parentId: block.parentId,
      index: getChildIndex(tree, id),
    };
  });
}
