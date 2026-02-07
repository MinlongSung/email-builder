import { normalizeWidths } from "./normalizeWidths";

export function calculateResizedWidths(
  currentWidths: number[],
  columnIndex: number,
  deltaPercent: number,
  minWidth: number
): number[] {
  const newWidths = [...currentWidths];
  const columnCount = currentWidths.length;

  const neighborIndex = columnIndex + 1;

  if (neighborIndex >= columnCount) {
    return currentWidths;
  }

  const currentWidth = currentWidths[columnIndex];
  const neighborWidth = currentWidths[neighborIndex];

  // Calculate the maximum delta we can apply
  const maxDelta = neighborWidth - minWidth;
  const minDelta = -(currentWidth - minWidth);

  const clampedDelta = Math.max(minDelta, Math.min(maxDelta, deltaPercent));

  if (Math.abs(clampedDelta) < 0.01) {
    return currentWidths;
  }

  newWidths[columnIndex] = Math.max(minWidth, currentWidth + clampedDelta);
  newWidths[neighborIndex] = Math.max(minWidth, neighborWidth - clampedDelta);

  return normalizeWidths(newWidths);
}
