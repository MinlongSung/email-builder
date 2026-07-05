import type { BlockTree } from "@/features/models/types";

import { Command } from "@/features/document/commands/Command";
import { getBlockById, getChildIndex } from "@/features/document/queries";
import { removeTree, addTree } from "@/features/document/utils";

export class RemoveTreeCommand extends Command {
  private tree!: BlockTree;
  private parentIds: Record<string, string> = {};
  private indexes: Record<string, number> = {};

  constructor(
    private readonly document: BlockTree,
    private readonly rootIds: string[],
  ) {
    super();
  }

  execute(): void {
    for (const rootId of this.rootIds) {
      const block = getBlockById(this.document, rootId);

      if (!block) {
        throw new Error(`Block "${rootId}" not found.`);
      }

      if (!block.parentId) {
        throw new Error(`Block "${rootId}" has no parent.`);
      }

      this.parentIds[rootId] = block.parentId;
      this.indexes[rootId] = getChildIndex(this.document, rootId);
    }

    this.tree = removeTree(this.document, this.rootIds);
  }

  undo(): void {
    // restore at original positions
    for (const rootId of this.tree.rootIds) {
      const parentId = this.parentIds[rootId];
      const index = this.indexes[rootId];

      addTree(
        this.document,
        this.tree,
        parentId,
        index,
      );
    }
  }
}