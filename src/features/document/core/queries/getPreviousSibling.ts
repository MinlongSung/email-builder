import type { Block, BlockTree } from "@/features/models/types";
import { getParent } from "@/features/document/core/queries/getParent";
import { getChildAt } from "@/features/document/core/queries/getChildAt";

export function getPreviousSibling(document: BlockTree, block: Block) {
  const parent = getParent(document, block);

  if (!parent) return;

  const index = parent.childrenIds.indexOf(block.id);

  return getChildAt(document, parent, index - 1);
}
