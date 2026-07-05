import type { BlockTree, Subtree } from "@/features/models/types";
import { Command } from "@/features/document/commands/Command";
import { getBlockById, getChildIndex } from "@/features/document/queries";
import { addSubtree, removeSubtree } from "@/features/document/utils";

export class RemoveSubtreeCommand extends Command {
  private subtree!: Subtree;

  private parentId!: string;

  private index!: number;

  constructor(
    private readonly document: BlockTree,
    private readonly rootId: string,
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

    this.parentId = block.parentId;
    this.index = getChildIndex(this.document, this.rootId);

    this.subtree = removeSubtree(this.document, this.rootId);
  }

  undo(): void {
    addSubtree(this.document, this.subtree, this.parentId, this.index);
  }
}
