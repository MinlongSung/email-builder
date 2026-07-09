import type { BlockTree } from "@/features/models/types";

import { sliceTree } from "@/features/document/core/queries";
import { generateId } from "@/features/utils/generateId";

/**
 * Duplicates a set of root blocks (and their descendants)
 * and inserts the cloned tree into a new parent.
 */
export function duplicateTree(
  document: BlockTree,
  rootIds: string[],
  parentId: string,
): BlockTree {
  // 1. Extract the selected tree (can be multiple roots)
  const tree = sliceTree(document, rootIds);

  const idMap = new Map<string, string>();

  // 2. Generate new IDs for all blocks in the extracted tree
  for (const id of Object.keys(tree.blocks)) {
    idMap.set(id, generateId());
  }

  const duplicated: BlockTree = {
    rootIds: tree.rootIds.map((id) => idMap.get(id)!),
    blocks: {},
  };

  // 3. Clone all blocks and remap relationships
  for (const block of Object.values(tree.blocks)) {
    const newId = idMap.get(block.id)!;

    const clone = structuredClone(block);

    clone.id = newId;

    // remap parent
    clone.parentId = block.parentId
      ? (idMap.get(block.parentId) ?? parentId)
      : parentId;

    // remap children
    clone.childrenIds = block.childrenIds.map((childId) => idMap.get(childId)!);

    duplicated.blocks[newId] = clone;
  }

  return duplicated;
}
