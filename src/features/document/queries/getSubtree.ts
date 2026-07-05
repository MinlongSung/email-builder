import type { Block, BlockTree, Subtree } from "@/features/models/types";

import { getBlockById } from "@/features/document/queries";

export function getSubtree(document: BlockTree, rootId: string): Subtree {
  const root = getBlockById(document, rootId);

  if (!root) throw new Error(`Block "${rootId}" not found.`);

  const blocks: Record<string, Block> = {};

  collect(document, root, blocks);

  return {
    rootId,
    blocks,
  };
}

function collect(
  document: BlockTree,
  block: Block,
  blocks: Record<string, Block>,
): void {
  blocks[block.id] = structuredClone(block);

  for (const childId of block.childrenIds) {
    const child = getBlockById(document, childId);

    if (!child) throw new Error(`Block "${childId}" not found.`);

    collect(document, child, blocks);
  }
}
