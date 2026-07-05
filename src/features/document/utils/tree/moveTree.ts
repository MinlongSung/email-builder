import type { BlockTree } from "@/features/models/types";

import { getBlockById } from "@/features/document/queries";
import { removeChild, insertChild } from "@/features/document/utils";

/**
 * Moves one or multiple root blocks (and their descendants)
 * as a single operation.
 */
export function moveTree(
  document: BlockTree,
  rootIds: string[],
  parentId: string,
  index?: number,
): void {
  const nextParent = getBlockById(document, parentId);

  if (!nextParent) {
    throw new Error(`Parent "${parentId}" not found.`);
  }

  let offset = 0;

  for (const rootId of rootIds) {
    const root = getBlockById(document, rootId);

    if (!root) {
      throw new Error(`Block "${rootId}" not found.`);
    }

    if (!root.parentId) {
      throw new Error(`Root block cannot be moved.`);
    }

    const previousParent = getBlockById(document, root.parentId);

    if (!previousParent) {
      throw new Error(`Parent "${root.parentId}" not found.`);
    }

    // detach from old parent
    removeChild(previousParent, root.id);

    // attach to new parent (preserve order inside moved group)
    insertChild(
      nextParent,
      root.id,
      index !== undefined ? index + offset : undefined,
    );

    root.parentId = parentId;

    offset++;
  }
}