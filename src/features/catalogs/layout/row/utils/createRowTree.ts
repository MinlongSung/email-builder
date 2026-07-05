import type { BlockTree, RowBlock } from "@/features/models/types";

import { createRowBlock } from "@/features/catalogs/layout/row/utils/createRowBlock";
import { createColumnBlock } from "@/features/catalogs/layout/row/utils/createColumnBlock";

export function createRowTree(
  widths: number[],
  overrides?: Partial<RowBlock["props"]>,
): BlockTree {
  const row = createRowBlock(overrides);

  const blocks: BlockTree["blocks"] = {
    [row.id]: row,
  };

  for (const width of widths) {
    const column = createColumnBlock({
      layout: { width: `${width}%` },
    });

    column.parentId = row.id;

    row.childrenIds.push(column.id);

    blocks[column.id] = column;
  }

  return {
    rootIds: [row.id],
    blocks,
  };
}
