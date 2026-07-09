import type { BlockTree } from "@/features/models/types";

import { Command } from "@/features/document/commands/Command";
import { addTree, duplicateTree, removeTree } from "@/features/document/utils";

export class DuplicateTreeCommand extends Command {
  private duplicated!: BlockTree;

  constructor(
    private readonly rootIds: string[],
    private readonly parentId: string,
    private readonly index?: number,
  ) {
    super();
  }

  execute(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    this.duplicated = duplicateTree(next, this.rootIds, this.parentId);

    addTree(next, this.duplicated, this.parentId, this.index);

    return next;
  }

  undo(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    removeTree(next, this.duplicated.rootIds);

    return next;
  }
}
