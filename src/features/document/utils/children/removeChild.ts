import type { Block } from "@/features/models/types";

export function removeChild(parent: Block, childId: string): void {
  const index = parent.childrenIds.indexOf(childId);

  if (index === -1) throw new Error(`Child "${childId}" not found.`);

  parent.childrenIds.splice(index, 1);
}
