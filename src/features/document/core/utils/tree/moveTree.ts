import type { BlockTree } from "@/features/models/types";

import {
  removeChild,
  insertChild,
  getBlockOrThrow,
} from "@/features/document/core/utils";

export function moveTree(
  document: BlockTree,
  rootIds: string[],
  parentId: string,
  index?: number,
): void {
  const parent = getBlockOrThrow(document, parentId);

  const roots = rootIds.map((id) => getBlockOrThrow(document, id));

  for (const root of roots) {
    if (!root.parentId) {
      throw new Error(`Root "${root.id}" cannot be moved.`);
    }

    const previousParent = getBlockOrThrow(document, root.parentId);

    removeChild(previousParent, root.id);
  }

  roots.forEach((root, offset) => {
    root.parentId = parentId;

    insertChild(
      parent,
      root.id,
      index !== undefined ? index + offset : undefined,
    );
  });
}
