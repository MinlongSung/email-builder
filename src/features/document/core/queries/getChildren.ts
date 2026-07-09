import type { Block, BlockTree } from "@/features/models/types";
import { getBlockById } from "@/features/document/core/queries/getBlockById";

export function getChildren(document: BlockTree, block: Block): Block[] {
  return block.childrenIds
    .map((id) => getBlockById(document, id))
    .filter(Boolean) as Block[];
}
