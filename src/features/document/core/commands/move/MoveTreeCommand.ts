import type { BlockTree } from "@/features/models/types";
import { Command } from "@/features/document/core/commands/Command";
import { moveTree } from "@/features/document/core/mutations";
import { getTreePositions } from "@/features/document/core/queries";

type TreePosition = {
  id: string;
  parentId: string;
  index: number;
};

export class MoveTreeCommand extends Command {
  private readonly from: readonly TreePosition[];

  constructor(
    document: BlockTree,
    private readonly rootIds: string[],
    private readonly to: Omit<TreePosition, "id" | "index"> &
      Partial<Pick<TreePosition, "index">>,
  ) {
    super();

    this.from = getTreePositions(document, rootIds);
  }

  execute(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    moveTree(next, this.rootIds, this.to.parentId, this.to.index);
    
    return next;
  }

  undo(document: BlockTree): BlockTree {
    const next = structuredClone(document);
    
    for (const position of this.from) {
      moveTree(next, [position.id], position.parentId, position.index);
    }
    
    return next;
  }
}
