import type { Block, BlockTree } from "@/features/models/types";
import { getParent } from "@/features/document/core/queries/getParent";

export function getAncestors(document: BlockTree, block: Block): Block[] {
  const result: Block[] = [];

  let current = getParent(document, block);

  while (current) {
    result.push(current);
    current = getParent(document, current);
  }

  return result;
}
