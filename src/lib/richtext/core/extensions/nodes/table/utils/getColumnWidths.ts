import type { Node } from "prosemirror-model";
import { TableMap } from "prosemirror-tables";
import { normalizeWidths } from "./normalizeWidths";

export function getColumnWidths(table: Node): number[] {
  const map = TableMap.get(table);
  const columnCount = map.width;
  const widths: number[] = new Array(columnCount).fill(0);
  const widthsFound: boolean[] = new Array(columnCount).fill(false);

  // Iterate through the first row to get column widths
  const firstRow = table.child(0);
  let colIndex = 0;

  for (let cellIndex = 0; cellIndex < firstRow.childCount; cellIndex++) {
    const cell = firstRow.child(cellIndex);
    const colspan = cell.attrs.colspan || 1;
    const colwidthAttr = cell.attrs.colwidth as number[] | null;

    if (colwidthAttr && colwidthAttr.length > 0) {
      for (let i = 0; i < colspan; i++) {
        if (colIndex + i < columnCount) {
          widths[colIndex + i] = colwidthAttr[i] || 0;
          widthsFound[colIndex + i] = colwidthAttr[i] > 0;
        }
      }
    }
    colIndex += colspan;
  }

  // Fill in missing widths with equal distribution
  const definedTotal = widths.reduce((sum, w) => sum + w, 0);
  const undefinedCount = widthsFound.filter((f) => !f).length;

  if (undefinedCount > 0) {
    const remainingSpace = Math.max(0, 100 - definedTotal);
    const defaultWidth = remainingSpace / undefinedCount;

    for (let i = 0; i < columnCount; i++) {
      if (!widthsFound[i]) {
        widths[i] = defaultWidth;
      }
    }
  }

  // If all undefined or total is 0, distribute equally
  const total = widths.reduce((sum, w) => sum + w, 0);
  if (total === 0 || undefinedCount === columnCount) {
    const equalWidth = 100 / columnCount;
    return widths.map(() => equalWidth);
  }

  return normalizeWidths(widths);
}