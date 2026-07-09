import type { DndState, DroppableContainer } from "@/features/dnd/core/types";
import type { BlockTree } from "@/features/models/types";
import { checkIsLeftHalf, checkIsTopHalf } from "@/features/dnd/core/utils";
import { getBlockById, getChildIndex } from "@/features/document/core/queries";
import { getBlockOrThrow } from "@/features/document/core/utils";

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

export const getInsertionIndex = (state: DndState, tree: BlockTree): number => {
  const { over, droppedOn } = state;

  const droppedBlock = getBlockById(tree, droppedOn.id);

  const overId = over?.id;
  if (!overId) return droppedBlock.childrenIds.length;

  const overIndex = getChildIndex(tree, overId);
  return state.isTopHalf ? overIndex : overIndex + 1;
};

interface NormalizeInsertionIndexOptions {
  tree: BlockTree;
  blockId: string;
  parentId: string;
  index: number;
}

export const normalizeInsertionIndex = ({
  tree,
  blockId,
  parentId,
  index,
}: NormalizeInsertionIndexOptions): number => {
  const block = getBlockById(tree, blockId);

  if (!block?.parentId) return index;

  // Si cambia de padre, el índice no cambia.
  if (block.parentId !== parentId) return index;

  const currentIndex = getChildIndex(tree, blockId);

  // Al mover hacia abajo dentro del mismo padre,
  // al quitar el bloque los índices disminuyen en uno.
  if (currentIndex < index) {
    return index - 1;
  }

  return index;
};

interface CheckIsSamePositionOptions {
  tree: BlockTree;
  blockId: string;
  parentId: string;
  index: number;
}

export const checkIsSamePosition = ({
  tree,
  blockId,
  parentId,
  index,
}: CheckIsSamePositionOptions): boolean => {
  const block = getBlockById(tree, blockId);

  if (!block || block.parentId !== parentId) {
    return false;
  }

  return getChildIndex(tree, blockId) === index;
};

export function getTreePositions(tree: BlockTree, ids: string[]) {
  return ids.map((id) => {
    const block = getBlockOrThrow(tree, id);

    if (!block.parentId) {
      throw new Error(`Block "${id}" has no parent.`);
    }

    return {
      id,
      parentId: block.parentId,
      index: getChildIndex(tree, id),
    };
  });
}
