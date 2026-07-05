import type { DndState, DroppableContainer } from "@/features/dnd/core/types";
import type { BlockTree } from "@/features/models/types";
import { isValidDropBlock } from "@/features/dnd/adapter/utils/isValidDropBlock";

export function getDroppedOnPath(
  state: DndState,
  tree: BlockTree,
): DroppableContainer[] {
  const { dragged, over, droppables } = state;

  if (!dragged || !over) return [];

  const path: DroppableContainer[] = [];

  let id: string | null = over.id;

  while (id) {
    const block = tree.blocks[id];
    if (!block) break;

    const candidate = droppables[id];
    if (candidate) path.unshift(candidate);
    if (isValidDropBlock(candidate, dragged.data.type)) return path;

    id = block.parentId;
  }

  return [];
}
