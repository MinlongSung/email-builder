import type { DuplicateTarget } from "@/features/document/core/queries";

export function resolveDuplicateInsertions(
  targets: DuplicateTarget[],
): DuplicateTarget[] {
  const offsets = new Map<string, number>();

  return targets.map((target) => {
    const offset = offsets.get(target.parentId) ?? 0;

    const resolved: DuplicateTarget = {
      ...target,
      insertIndex: target.insertIndex + offset,
    };

    offsets.set(
      target.parentId,
      offset + target.rootIds.length,
    );

    return resolved;
  });
}