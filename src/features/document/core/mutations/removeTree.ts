import type { BlockTree } from "@/features/models/types";

import { sliceTree, getBlockOrThrow } from "@/features/document/core/queries";
import { removeChild } from "@/features/document/core/mutations";

export function removeTree(document: BlockTree, rootIds: string[]): BlockTree {
  const tree = sliceTree(document, rootIds);

  const removedRootIds: string[] = [];

  for (const rootId of rootIds) {
    const root = getBlockOrThrow(document, rootId);

    if (!root.parentId) {
      throw new Error(`Root block cannot be removed.`);
    }

    const parent = getBlockOrThrow(document, root.parentId);

    removeChild(parent, root.id);

    removedRootIds.push(root.id);
  }

  for (const id of Object.keys(tree.blocks)) {
    delete document.blocks[id];
  }

  return {
    rootIds: removedRootIds,
    blocks: tree.blocks,
  };
}
