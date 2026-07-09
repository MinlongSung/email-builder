import type { BlockTree } from "@/features/models/types";

import { Command } from "@/features/document/core/commands/Command";
import { getDuplicateTargets } from "@/features/document/core/queries";
import {
  duplicateTree,
  resolveDuplicateInsertions,
} from "@/features/document/core/utils";
import { addTree, removeTree } from "@/features/document/core/mutations";

interface DuplicateInsertion {
  readonly duplicatedTree: BlockTree;
  readonly parentId: string;
  readonly insertIndex: number;
}
export class DuplicateTreeCommand extends Command {
  private readonly insertions: readonly DuplicateInsertion[];

  constructor(document: BlockTree, rootIds: string[]) {
    super();

    const targets = resolveDuplicateInsertions(
      getDuplicateTargets(document, rootIds),
    );

    this.insertions = targets.map((target) => ({
      duplicatedTree: duplicateTree(document, target.rootIds),
      parentId: target.parentId,
      insertIndex: target.insertIndex,
    }));
  }

  execute(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    for (const insertion of this.insertions) {
      addTree(
        next,
        insertion.duplicatedTree,
        insertion.parentId,
        insertion.insertIndex,
      );
    }

    return next;
  }

  undo(document: BlockTree): BlockTree {
    const next = structuredClone(document);

    for (const insertion of this.insertions) {
      removeTree(next, insertion.duplicatedTree.rootIds);
    }

    return next;
  }
}
