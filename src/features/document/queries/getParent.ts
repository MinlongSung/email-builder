import type { Block, BlockTree } from "@/features/models/types";
import { getBlockById } from "@/features/document/queries/getBlockById";

export function getParent(
  document: BlockTree,
  block: Block,
): Block | undefined {
  return block.parentId ? getBlockById(document, block.parentId) : undefined;
}
