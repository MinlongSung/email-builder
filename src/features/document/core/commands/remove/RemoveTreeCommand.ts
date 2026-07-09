import type { BlockTree } from "@/features/models/types";
import { Command } from "@/features/document/core/commands/Command";
import { getTreePositions, sliceTree } from "@/features/document/core/queries";
import { removeTree, addTree } from "@/features/document/core/mutations";

export class RemoveTreeCommand extends Command {
  private readonly tree: BlockTree;
  private readonly parentIds: Record<string, string> = {};
  private readonly indexes: Record<string, number> = {};

  constructor(document: BlockTree, private readonly rootIds: string[]) {
    super();

    const positions = getTreePositions(document, rootIds);
    
    for (const position of positions) {
      this.parentIds[position.id] = position.parentId;
      this.indexes[position.id] = position.index;
    }

    this.tree = sliceTree(document, rootIds);
  }

  execute(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    removeTree(next, this.rootIds);

    return next;
  }

  undo(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    for (const rootId of this.tree.rootIds) {
      const parentId = this.parentIds[rootId];
      const index = this.indexes[rootId];
      addTree(next, this.tree, parentId, index);
    }
    
    return next;
  }
}
