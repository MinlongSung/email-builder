import type { Block, BlockTree } from "@/features/models/types";

export function createContentTree(block: Block): BlockTree {
  return {
    rootIds: [block.id],
    blocks: {
      [block.id]: block,
    },
  };
}
