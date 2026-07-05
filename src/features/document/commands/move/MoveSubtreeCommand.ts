import type { BlockTree } from "@/features/models/types";
import { Command } from "@/features/document/commands/Command";
import { moveSubtree } from "@/features/document/utils";
import { getBlockById, getChildIndex } from "@/features/document/queries";

export class MoveSubtreeCommand extends Command {
  private previousParentId!: string;

  private previousIndex!: number;

  constructor(
    private readonly document: BlockTree,
    private readonly rootId: string,
    private readonly parentId: string,
    private readonly index?: number,
  ) {
    super();
  }

  execute(): void {
    const block = getBlockById(this.document, this.rootId);

    if (!block) {
      throw new Error(`Block "${this.rootId}" not found.`);
    }

    if (!block.parentId) {
      throw new Error(`Block "${this.rootId}" has no parent.`);
    }

    this.previousParentId = block.parentId;
    this.previousIndex = getChildIndex(this.document, this.rootId);

    moveSubtree(this.document, this.rootId, this.parentId, this.index);
  }

  undo(): void {
    moveSubtree(
      this.document,
      this.rootId,
      this.previousParentId,
      this.previousIndex,
    );
  }
}
