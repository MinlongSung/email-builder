import type { Block, BlockTree } from "@/features/models/types";
import { getChildren } from "@/features/document/queries";

export function getDescendants(
  document: BlockTree,
  block: Block,
): Block[] {
  const result: Block[] = [];

  function walk(node: Block) {
    const children = getChildren(document, node);

    for (const child of children) {
      result.push(child);
      walk(child);
    }
  }

  walk(block);

  return result;
}