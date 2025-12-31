export function distributeWidthEvenly(
  currentWidths: number[],
  minWidth: number
): number[] | null {
  const newCount = currentWidths.length + 1;
  const maxColumns = Math.floor(100 / minWidth);

  // Cannot add if would exceed max
  if (newCount > maxColumns) {
    return null;
  }

  // ALWAYS equal distribution
  const equalWidth = 100 / newCount;
  return Array(newCount).fill(equalWidth);
}
