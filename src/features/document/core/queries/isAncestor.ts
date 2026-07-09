import type { Block, BlockTree } from "@/features/models/types";
import { getParent } from "@/features/document/core/queries/getParent";

export function isAncestor(
  document: BlockTree,
  ancestor: Block,
  descendant: Block,
): boolean {
  let current = getParent(document, descendant);

  while (current) {
    if (current.id === ancestor.id) return true;

    current = getParent(document, current);
  }

  return false;
}
