export function normalizeWidths(widths: number[]): number[] {
  if (widths.length === 0) return [];

  const total = widths.reduce((sum, w) => sum + w, 0);
  if (total === 0) {
    const equalWidth = 100 / widths.length;
    return widths.map(() => equalWidth);
  }

  const normalized = widths.map((w) => (w / total) * 100);

  // Round to 2 decimal places
  const rounded = normalized.map((w) => Math.round(w * 100) / 100);

  // Adjust last column to compensate for rounding errors
  const sum = rounded.reduce((s, w) => s + w, 0);
  const diff = 100 - sum;
  rounded[rounded.length - 1] =
    Math.round((rounded[rounded.length - 1] + diff) * 100) / 100;

  return rounded;
}
