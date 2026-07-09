import type { BlockTree } from "@/features/models/types";

import { getBlockOrThrow, insertChild } from "@/features/document/core/utils";

export function addTree(
  document: BlockTree,
  tree: BlockTree,
  parentId: string,
  index?: number,
): void {
  const parent = getBlockOrThrow(document, parentId);

  for (const block of Object.values(tree.blocks)) {
    document.blocks[block.id] = structuredClone(block);
  }

  for (const rootId of tree.rootIds) {
    const root = getBlockOrThrow(document, rootId);

    root.parentId = parentId;

    insertChild(parent, root.id, index);
  }
}
