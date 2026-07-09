import type { BlockTree } from "@/features/models/types";

export abstract class Command {
  abstract execute(document: BlockTree): BlockTree;
  abstract undo(document: BlockTree): BlockTree;
}
