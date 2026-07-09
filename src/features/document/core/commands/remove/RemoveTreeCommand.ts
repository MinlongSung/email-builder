import type { BlockTree } from "@/features/models/types";

import { Command } from "@/features/document/commands/Command";
import { getBlockById, getChildIndex } from "@/features/document/core/queries";
import {
  removeTree,
  addTree,
  getBlockOrThrow,
} from "@/features/document/utils";

export class RemoveTreeCommand extends Command {
  private tree!: BlockTree;
  private parentIds: Record<string, string> = {};
  private indexes: Record<string, number> = {};

  constructor(private readonly rootIds: string[]) {
    super();
  }

  execute(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    for (const rootId of this.rootIds) {
      const block = getBlockOrThrow(next, rootId);

      if (!block.parentId) {
        throw new Error(`Block "${rootId}" has no parent.`);
      }

      this.parentIds[rootId] = block.parentId;
      this.indexes[rootId] = getChildIndex(next, rootId);
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
