import type { BlockTree, Subtree } from "@/features/models/types";

import { getSubtree } from "@/features/document/queries";
import { addSubtree } from "./addSubtree";
import { generateId } from "@/features/utils/generateId";

export function duplicateSubtree(
  document: BlockTree,
  rootId: string,
  parentId: string,
  index?: number,
): Subtree {
  const subtree = getSubtree(document, rootId);

  const ids = new Map<string, string>();

  for (const id of Object.keys(subtree.blocks)) {
    ids.set(id, generateId());
  }

  const duplicated: Subtree = {
    rootId: ids.get(subtree.rootId)!,
    blocks: {},
  };

  for (const block of Object.values(subtree.blocks)) {
    const clone = structuredClone(block);

    clone.id = ids.get(block.id)!;

    clone.parentId = block.parentId
      ? (ids.get(block.parentId) ?? parentId)
      : parentId;

    clone.childrenIds = block.childrenIds.map((id) => ids.get(id)!);

    duplicated.blocks[clone.id] = clone;
  }

  addSubtree(document, duplicated, parentId, index);

  return duplicated;
}
