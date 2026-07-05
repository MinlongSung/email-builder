import type { BlockTree } from "@/features/models/types";

import { getBlockById } from "@/features/document/queries";
import { insertChild } from "@/features/document/utils";

export function addTree(
  document: BlockTree,
  tree: BlockTree,
  parentId: string,
  index?: number,
): void {
  const parent = getBlockById(document, parentId);

  if (!parent) {
    throw new Error(`Parent "${parentId}" not found.`);
  }

  for (const block of Object.values(tree.blocks)) {
    document.blocks[block.id] = structuredClone(block);
  }

  for (const rootId of tree.rootIds) {
    const root = document.blocks[rootId];

    if (!root) {
      throw new Error(`Root "${rootId}" not found in tree.`);
    }

    root.parentId = parentId;

    insertChild(parent, root.id, index);
  }
}
