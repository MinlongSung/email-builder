import type { BlockTree } from "@/features/models/types";

import { sliceTree } from "@/features/document/queries";
import { getBlockById } from "@/features/document/queries";
import { removeChild } from "@/features/document/utils";

/**
 * Removes one or multiple root blocks (and their descendants)
 * from the document tree.
 *
 * Returns the removed BlockTree snapshot.
 */
export function removeTree(document: BlockTree, rootIds: string[]): BlockTree {
  const tree = sliceTree(document, rootIds);

  const removedRootIds: string[] = [];

  for (const rootId of rootIds) {
    const root = getBlockById(document, rootId);

    if (!root) {
      throw new Error(`Block "${rootId}" not found.`);
    }

    if (!root.parentId) {
      throw new Error(`Root block cannot be removed.`);
    }

    const parent = getBlockById(document, root.parentId);

    if (!parent) {
      throw new Error(`Parent "${root.parentId}" not found.`);
    }

    removeChild(parent, root.id);

    removedRootIds.push(root.id);
  }

  // delete all blocks in the extracted tree
  for (const id of Object.keys(tree.blocks)) {
    delete document.blocks[id];
  }

  return {
    rootIds: removedRootIds,
    blocks: tree.blocks,
  };
}
