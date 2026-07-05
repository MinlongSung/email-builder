import type { BlockTree, Subtree } from "@/features/models/types";

import { getBlockById } from "@/features/document/queries";
import { insertChild } from "@/features/document/utils";

export function addSubtree(
  document: BlockTree,
  subtree: Subtree,
  parentId: string,
  index?: number,
): void {
  const parent = getBlockById(document, parentId);

  if (!parent) throw new Error(`Parent "${parentId}" not found.`);

  for (const block of Object.values(subtree.blocks)) {
    document.blocks[block.id] = structuredClone(block);
  }

  const root = document.blocks[subtree.rootId];

  root.parentId = parentId;

  insertChild(parent, root.id, index);
}