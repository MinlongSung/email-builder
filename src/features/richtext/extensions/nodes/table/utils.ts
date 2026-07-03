import type { Node, Attrs } from "@tiptap/pm/model";
import { TableMap } from "@tiptap/pm/tables";
import type { Transaction } from "@tiptap/pm/state";

export const tableCellAttributes = {
  colwidth: {
    default: null,
    parseHTML: (el: HTMLElement) => {
      const raw =
        el.getAttribute("data-colwidth") ?? el.getAttribute("colwidth");
      return raw ? raw.split(",").map((w) => parseFloat(w)) : null;
    },
    renderHTML: (attrs: Attrs) => {
      if (!attrs.colwidth) return {};
      const widths = attrs.colwidth as number[];
      return {
        "data-colwidth": widths.map((w) => w.toFixed(2)).join(","),
        style: `width: ${widths[0].toFixed(2)}%`,
      };
    },
  },

  backgroundColor: {
    default: null,
    parseHTML: (el: HTMLElement) => el.style.backgroundColor || null,
    renderHTML: (attrs: Attrs) =>
      attrs.backgroundColor
        ? { style: `background-color: ${attrs.backgroundColor}` }
        : {},
  },

  borderWidth: {
    default: null,
    parseHTML: (el: HTMLElement) => el.style.borderWidth || null,
    renderHTML: (attrs: Attrs) =>
      attrs.borderWidth ? { style: `border-width: ${attrs.borderWidth}` } : {},
  },

  borderStyle: {
    default: null,
    parseHTML: (el: HTMLElement) => el.style.borderStyle || null,
    renderHTML: (attrs: Attrs) =>
      attrs.borderStyle ? { style: `border-style: ${attrs.borderStyle}` } : {},
  },

  borderColor: {
    default: null,
    parseHTML: (el: HTMLElement) => el.style.borderColor || null,
    renderHTML: (attrs: Attrs) =>
      attrs.borderColor ? { style: `border-color: ${attrs.borderColor}` } : {},
  },
};

export function calculateResizedWidths(
  currentWidths: number[],
  col: number,
  deltaPercent: number,
  minWidth: number,
): number[] {
  const next = col + 1;
  if (next >= currentWidths.length) return currentWidths;

  const cur = currentWidths[col];
  const nbr = currentWidths[next];

  const maxDelta = nbr - minWidth;
  const minDelta = -(cur - minWidth);
  const delta = Math.max(minDelta, Math.min(maxDelta, deltaPercent));

  if (Math.abs(delta) < 0.01) return currentWidths;

  const result = [...currentWidths];
  result[col] = Math.max(minWidth, cur + delta);
  result[next] = Math.max(minWidth, nbr - delta);
  return normalizeWidths(result);
}

export function distributeWidthEvenly(
  currentCount: number,
  minWidth: number,
): number[] | null {
  const newCount = currentCount + 1;
  if (newCount > Math.floor(100 / minWidth)) return null;
  const w = 100 / newCount;
  return Array(newCount).fill(w);
}

export function getColumnWidths(table: Node): number[] {
  const map = TableMap.get(table);
  const columnCount = map.width;
  const widths: number[] = new Array(columnCount).fill(0);
  let undefinedCount = columnCount;

  const firstRow = table.child(0);
  let colIndex = 0;

  for (let i = 0; i < firstRow.childCount; i++) {
    const cell = firstRow.child(i);
    const colspan: number = cell.attrs.colspan || 1;
    const colwidth: number[] | null = cell.attrs.colwidth;

    if (colwidth && colwidth.length > 0) {
      for (let j = 0; j < colspan; j++) {
        if (colIndex + j < columnCount) {
          const w = colwidth[j] || 0;
          widths[colIndex + j] = w;
          if (w > 0) undefinedCount--;
        }
      }
    }
    colIndex += colspan;
  }

  if (undefinedCount > 0) {
    const definedTotal = widths.reduce((s, w) => s + w, 0);
    const remaining = Math.max(0, 100 - definedTotal);
    const defaultWidth = remaining / undefinedCount;
    for (let i = 0; i < columnCount; i++) {
      if (widths[i] === 0) widths[i] = defaultWidth;
    }
  }

  return normalizeWidths(widths);
}

export function normalizeWidths(widths: number[]): number[] {
  if (widths.length === 0) return [];

  const total = widths.reduce((s, w) => s + w, 0);
  if (total === 0) {
    const eq = 100 / widths.length;
    return widths.map(() => eq);
  }

  const rounded = widths.map((w) => Math.round((w / total) * 10000) / 100);
  // Compensate rounding error on the last column
  const diff = 100 - rounded.reduce((s, w) => s + w, 0);
  rounded[rounded.length - 1] =
    Math.round((rounded[rounded.length - 1] + diff) * 100) / 100;
  return rounded;
}

export function updateAllCellWidths(
  tr: Transaction,
  tablePos: number,
  table: Node,
  newWidths: number[],
): void {
  const map = TableMap.get(table);
  const seen = new Set<number>();

  for (let row = 0; row < map.height; row++) {
    for (let col = 0; col < map.width; col++) {
      const cellOffset = map.map[row * map.width + col];
      if (seen.has(cellOffset)) continue;
      seen.add(cellOffset);

      // Absolute position of the cell node: tablePos + 1 (table opening) + cellOffset
      const cellAbsPos = tablePos + 1 + cellOffset;
      const cellNode = tr.doc.nodeAt(cellAbsPos);
      if (!cellNode) continue;

      const colspan: number = cellNode.attrs.colspan || 1;
      const colwidth: number[] = [];
      for (let i = 0; i < colspan; i++) {
        const idx = col + i;
        if (idx < newWidths.length) colwidth.push(newWidths[idx]);
      }

      tr.setNodeMarkup(cellAbsPos, null, { ...cellNode.attrs, colwidth });
    }
  }
}
