import type { Block, BlockTree } from "@/features/models/types";
import { getBlockById } from "@/features/document/queries";

export function sliceTree(
  tree: BlockTree,
  rootIds: string[],
): BlockTree {
  const blocks: Record<string, Block> = {};

  for (const rootId of rootIds) {
    const root = getBlockById(tree, rootId);

    if (!root) {
      throw new Error(`Block "${rootId}" not found.`);
    }

    collect(tree, root, blocks);
  }

  return {
    rootIds,
    blocks,
  };
}

function collect(
  tree: BlockTree,
  block: Block,
  out: Record<string, Block>,
): void {
  if (out[block.id]) return;

  out[block.id] = structuredClone(block);

  for (const childId of block.childrenIds) {
    const child = getBlockById(tree, childId);

    if (!child) {
      throw new Error(`Block "${childId}" not found.`);
    }

    collect(tree, child, out);
  }
}