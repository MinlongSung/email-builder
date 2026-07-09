import type { BlockTree } from "@/features/models/types";
import { Command } from "@/features/document/core/commands/Command";
import { addTree, removeTree } from "@/features/document/core/utils";

export class AddTreeCommand extends Command {
  constructor(
    private readonly tree: BlockTree,
    private readonly parentId: string,
    private readonly index?: number,
  ) {
    super();
  }

  execute(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    addTree(next, this.tree, this.parentId, this.index);

    return next;
  }

  undo(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    removeTree(next, this.tree.rootIds);

    return next;
  }
}
