import type { BlockTree } from "@/features/models/types";

import { getBlockOrThrow } from "@/features/document/core/queries";
import { insertChild } from "@/features/document/core/mutations";

export function addTree(
  document: BlockTree,
  tree: BlockTree,
  parentId: string,
  index: number = 0,
): void {
  const parent = getBlockOrThrow(document, parentId);

  for (const block of Object.values(tree.blocks)) {
    document.blocks[block.id] = structuredClone(block);
  }

  tree.rootIds.forEach((rootId, offset) => {
    const root = getBlockOrThrow(document, rootId);

    root.parentId = parentId;

    insertChild(parent, root.id, index + offset);
  });
}
