import type { BlockTree } from "@/features/models/types";

import { getTreePositions } from "@/features/document/core/queries";

export type DuplicateTarget = {
  parentId: string;
  rootIds: string[];
  insertIndex: number;
};

export function getDuplicateTargets(
  document: BlockTree,
  rootIds: string[],
): DuplicateTarget[] {
  const positions = getTreePositions(document, rootIds);

  const targets: DuplicateTarget[] = [];

  let current: DuplicateTarget | null = null;
  let previousParentId: string | null = null;
  let previousIndex = -1;

  for (const position of positions) {
    const adjacent =
      current &&
      position.parentId === previousParentId &&
      position.index === previousIndex + 1;

    if (adjacent) {
      current.rootIds.push(position.id);
      current.insertIndex = position.index + 1;
    } else {
      current = {
        parentId: position.parentId,
        rootIds: [position.id],
        insertIndex: position.index + 1,
      };

      targets.push(current);
    }

    previousParentId = position.parentId;
    previousIndex = position.index;
  }

  return targets;
}