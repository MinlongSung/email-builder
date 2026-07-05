import type { BlockTree, Subtree } from "@/features/models/types";

import { getSubtree } from "@/features/document/queries";

import { getBlockById } from "@/features/document/queries";
import { removeChild } from "@/features/document/utils";

export function removeSubtree(document: BlockTree, rootId: string): Subtree {
  const subtree = getSubtree(document, rootId);

  const root = getBlockById(document, rootId);

  if (!root) throw new Error(`Block "${rootId}" not found.`);

  if (!root.parentId) throw new Error(`Root block cannot be removed.`);

  const parent = getBlockById(document, root.parentId);

  if (!parent) throw new Error(`Parent "${root.parentId}" not found.`);

  removeChild(parent, root.id);

  for (const id of Object.keys(subtree.blocks)) {
    delete document.blocks[id];
  }

  return subtree;
}
