import type { BlockTree } from "@/features/models/types";

import { Command } from "@/features/document/core/commands/Command";
import { getChildIndex, getTreePositions } from "@/features/document/core/queries";
import { removeTree, addTree } from "@/features/document/core/mutations";
import { getBlockOrThrow } from "@/features/document/core/queries";

export class RemoveTreeCommand extends Command {
  private tree!: BlockTree;
  private parentIds: Record<string, string> = {};
  private indexes: Record<string, number> = {};

  constructor(private readonly rootIds: string[]) {
    super();
  }

  execute(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    const positions = getTreePositions(next, this.rootIds);

    for (const position of positions) {
      this.parentIds[position.id] = position.parentId;
      this.indexes[position.id] = position.index;
    }

    this.tree = removeTree(next, this.rootIds);
    return next;
  }

  undo(document: BlockTree): BlockTree {
    const next = structuredClone(document);
    // restore at original positions
    for (const rootId of this.tree.rootIds) {
      const parentId = this.parentIds[rootId];
      const index = this.indexes[rootId];

      addTree(next, this.tree, parentId, index);
    }
    return next;
  }
}
