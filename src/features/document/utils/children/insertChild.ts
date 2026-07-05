import type { Block } from "@/features/models/types";

export function insertChild(parent: Block, childId: string, index?: number) {
  parent.childrenIds.splice(index ?? parent.childrenIds.length, 0, childId);
}
