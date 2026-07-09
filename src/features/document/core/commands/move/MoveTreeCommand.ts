import type { BlockTree } from "@/features/models/types";

import { Command } from "@/features/document/core/commands/Command";
import { moveTree } from "@/features/document/core/utils";

type TreePosition = {
  id: string;
  parentId: string;
  index: number;
};

export class MoveTreeCommand extends Command {
  constructor(
    private readonly rootIds: string[],
    private readonly from: TreePosition[],
    private readonly to: Omit<TreePosition, "id" | "index"> &
      Partial<Pick<TreePosition, "index">>,
  ) {
    super();
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
