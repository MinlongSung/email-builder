import type { Block, BlockTree } from "@/features/models/types";
import { getBlockById } from "@/features/document/queries/getBlockById";

export function getChildAt(
  document: BlockTree,
  block: Block,
  index: number,
): Block | undefined {
  const id = block.childrenIds[index];

  return id ? getBlockById(document, id) : undefined;
}