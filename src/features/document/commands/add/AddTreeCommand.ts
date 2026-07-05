import type { BlockTree } from "@/features/models/types";
import { Command } from "@/features/document/commands/Command";
import { addTree, removeTree } from "@/features/document/utils";

export class AddTreeCommand extends Command {
  constructor(
    private readonly document: BlockTree,
    private readonly tree: BlockTree,
    private readonly parentId: string,
    private readonly index?: number,
  ) {
    super();
  }

  execute(): void {
    addTree(
      this.document,
      this.tree,
      this.parentId,
      this.index,
    );
  }

  undo(): void {
    removeTree(
      this.document,
      this.tree.rootIds,
    );
  }
}