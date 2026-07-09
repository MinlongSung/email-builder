import type { BlockTree } from "@/features/models/types";

import { Command } from "@/features/document/core/commands/Command";
import {
  getDuplicateTargets,
} from "@/features/document/core/queries";
import {
  duplicateTree,
  resolveDuplicateInsertions,
} from "@/features/document/core/utils";
import {
  addTree,
  removeTree,
} from "@/features/document/core/mutations";

export class DuplicateTreeCommand extends Command {
  private duplicated: BlockTree[] = [];

  constructor(
    private readonly rootIds: string[],
  ) {
    super();
  }

  execute(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    const targets = resolveDuplicateInsertions(
      getDuplicateTargets(
        next,
        this.rootIds,
      ),
    );

    this.duplicated = [];

    for (const target of targets) {
      const duplicated = duplicateTree(
        next,
        target.rootIds,
      );

      addTree(
        next,
        duplicated,
        target.parentId,
        target.insertIndex,
      );

      this.duplicated.push(duplicated);
    }

    return next;
  }

  undo(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    for (const tree of this.duplicated) {
      removeTree(next, tree.rootIds);
    }

    return next;
  }
}