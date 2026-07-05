import type { DroppableContainer } from "@/features/dnd/core/types";

export function isValidDropBlock(
  candidate: DroppableContainer | undefined,
  draggedType: string,
) {
  return (
    !!candidate &&
    !candidate.disabled &&
    candidate.data.accepts.includes(draggedType)
  );
}
