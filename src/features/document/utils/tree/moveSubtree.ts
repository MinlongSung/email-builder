import type { BlockTree } from "@/features/models/types";

import { getBlockById } from "@/features/document/queries";
import { removeChild, insertChild } from "@/features/document/utils";

export function moveSubtree(
  document: BlockTree,
  rootId: string,
  parentId: string,
  index?: number,
): void {
  const root = getBlockById(document, rootId);

  if (!root) throw new Error(`Block "${rootId}" not found.`);

  if (!root.parentId) throw new Error(`Root block cannot be moved.`);

  const previousParent = getBlockById(document, root.parentId);

  if (!previousParent) throw new Error(`Parent "${root.parentId}" not found.`);

  const nextParent = getBlockById(document, parentId);

  if (!nextParent) throw new Error(`Parent "${parentId}" not found.`);

  removeChild(previousParent, root.id);

  insertChild(nextParent, root.id, index);

  root.parentId = parentId;
}
