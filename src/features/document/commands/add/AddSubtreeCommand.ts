import type { BlockTree, Subtree } from "@/features/models/types";
import { Command } from "@/features/document/commands/Command";
import { addSubtree, removeSubtree } from "@/features/document/utils";

export class AddSubtreeCommand extends Command {
  constructor(
    private readonly document: BlockTree,
    private readonly subtree: Subtree,
    private readonly parentId: string,
    private readonly index?: number,
  ) {
    super();
  }

  execute(): void {
    addSubtree(
      this.document,
      this.subtree,
      this.parentId,
      this.index,
    );
  }

  undo(): void {
    removeSubtree(
      this.document,
      this.subtree.rootId,
    );
  }
}