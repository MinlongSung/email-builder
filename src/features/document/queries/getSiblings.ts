import type { Block, BlockTree } from "@/features/models/types";
import { getParent } from "@/features/document/queries/getParent";
import { getChildren } from "@/features/document/queries/getChildren";

export function getSiblings(document: BlockTree, block: Block): Block[] {
  const parent = getParent(document, block);

  if (!parent) return [];

  return getChildren(document, parent).filter((child) => child.id !== block.id);
}
