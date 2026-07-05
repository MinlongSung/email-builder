import type { BlockTree } from "@/features/models/types";

import { Command } from "@/features/document/commands/Command";
import { moveTree } from "@/features/document/utils";
import { getBlockById, getChildIndex } from "@/features/document/queries";

export class MoveTreeCommand extends Command {
  private previousParentIds: Record<string, string> = {};
  private previousIndexes: Record<string, number> = {};

  constructor(
    private readonly document: BlockTree,
    private readonly rootIds: string[],
    private readonly parentId: string,
    private readonly index?: number,
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

      this.previousParentIds[rootId] = block.parentId;
      this.previousIndexes[rootId] = getChildIndex(this.document, rootId);
    }

    moveTree(
      this.document,
      this.rootIds,
      this.parentId,
      this.index,
    );
  }

  undo(): void {
    // restore original structure
    for (const rootId of this.rootIds) {
      const prevParent = this.previousParentIds[rootId];
      const prevIndex = this.previousIndexes[rootId];

      moveTree(
        this.document,
        [rootId],
        prevParent,
        prevIndex,
      );
    }
  }
}