import type { BlockTree } from "@/features/models/types";
import { getBlockById } from "@/features/document/core/queries";

export function getBlockOrThrow(document: BlockTree, id: string) {
  const block = getBlockById(document, id);

  if (!block) {
    throw new Error(`Block "${id}" not found.`);
  }

  return block;
}
