import type { Node } from "prosemirror-model";
import type { Transaction } from "prosemirror-state";
import { TableMap } from "prosemirror-tables";

export function updateAllCellWidths(
  tr: Transaction,
  tableStart: number,
  table: Node,
  newWidths: number[]
): void {
  const map = TableMap.get(table);
  const updatedCells = new Set<number>();

  for (let row = 0; row < map.height; row++) {
    for (let col = 0; col < map.width; col++) {
      const cellPos = map.map[row * map.width + col];

      if (updatedCells.has(cellPos)) continue;
      updatedCells.add(cellPos);

      const cellStart = tableStart + cellPos + 1;
      const cell = tr.doc.nodeAt(cellStart);
      if (!cell) continue;

      const colspan = cell.attrs.colspan || 1;

      // Get widths for this cell's columns
      const colwidth: number[] = [];
      for (let i = 0; i < colspan; i++) {
        const colIndex = col + i;
        if (colIndex < newWidths.length) {
          colwidth.push(newWidths[colIndex]);
        }
      }

      tr.setNodeMarkup(cellStart, null, {
        ...cell.attrs,
        colwidth,
      });
    }
  }
}