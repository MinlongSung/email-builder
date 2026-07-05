import type { BlockTree } from "@/features/models/types";

import { Command } from "@/features/document/commands/Command";
import { duplicateTree, removeTree } from "@/features/document/utils";

export class DuplicateTreeCommand extends Command {
  private duplicated!: BlockTree;

  constructor(
    private readonly document: BlockTree,
    private readonly rootIds: string[],
    private readonly parentId: string,
    private readonly index?: number,
  ) {
    super();
  }

  execute(): void {
    this.duplicated = duplicateTree(
      this.document,
      this.rootIds,
      this.parentId,
      this.index,
    );
  }

  undo(): void {
    removeTree(this.document, this.duplicated.rootIds);
  }
}