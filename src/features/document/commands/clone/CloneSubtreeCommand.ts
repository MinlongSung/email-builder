import type { BlockTree, Subtree } from "@/features/models/types";
import { Command } from "@/features/document/commands/Command";
import { duplicateSubtree, removeSubtree } from "@/features/document/utils";

export class DuplicateSubtreeCommand extends Command {
  private duplicated!: Subtree;

  constructor(
    private readonly document: BlockTree,
    private readonly rootId: string,
    private readonly parentId: string,
    private readonly index?: number,
  ) {
    super();
  }

  execute(): void {
    this.duplicated = duplicateSubtree(
      this.document,
      this.rootId,
      this.parentId,
      this.index,
    );
  }

  undo(): void {
    removeSubtree(this.document, this.duplicated.rootId);
  }
}
