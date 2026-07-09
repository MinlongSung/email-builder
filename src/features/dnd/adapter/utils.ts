import type { BlockTree } from "@/features/models/types";
import type { DndState, DroppableContainer } from "@/features/dnd/core/types";
import { checkIsLeftHalf, checkIsTopHalf } from "@/features/dnd/core/utils";
import { getBlockById, getChildIndex } from "@/features/document/core/queries";

const checkIsValidDrop = (
  candidate: DroppableContainer | undefined,
  draggedType: string,
) => {
  return (
    !!candidate &&
    !candidate.disabled &&
    candidate.data.accepts.includes(draggedType)
  );
};

const getDroppedOnPath = (
  state: DndState,
  tree: BlockTree,
): DroppableContainer[] => {
  const { dragged, over, droppables } = state;

  if (!dragged || !over) return [];

  const path: DroppableContainer[] = [];

  let id: string | null = over.id;

  while (id) {
    const block = tree.blocks[id];
    if (!block) break;

    const candidate = droppables[id];
    if (candidate) path.unshift(candidate);
    if (checkIsValidDrop(candidate, dragged.data.type)) return path;

    id = block.parentId;
  }

  return [];
};

export const resolveDragState = (state: DndState, tree: BlockTree) => {
  const path = getDroppedOnPath(state, tree);

  const [droppedOn, over] = path;

  return {
    ...state,
    droppedOn: droppedOn ?? null,
    over: over ?? null,
    isTopHalf: over ? checkIsTopHalf(over.rect, state.coordinates) : false,
    isLeftHalf: over ? checkIsLeftHalf(over.rect, state.coordinates) : false,
  };
};

export function getInsertionIndex(state: DndState, tree: BlockTree): number {
  const { over, droppedOn, isTopHalf } = state;

  if (!droppedOn) {
    throw new Error("Missing drop target.");
  }

  if (!over) {
    return getBlockById(tree, droppedOn.id).childrenIds.length;
  }

  const index = getChildIndex(tree, over.id);
  return isTopHalf ? index : index + 1;
}
