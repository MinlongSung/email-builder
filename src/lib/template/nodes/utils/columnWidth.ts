import type { ColumnEntity } from '$lib/template/types';

/**
 * Minimum width (%) that any column can have.
 */
export const COLUMN_MIN_WIDTH = 5;
export const COLUMN_WIDTH_STEP = 5;

/**
 * Returns the maximum width (%) a single column can occupy.
 *
 * All columns together must add up to 100%.
 * Each of the OTHER columns needs at least COLUMN_MIN_WIDTH.
 *
 * Example: 4 columns → max = 100 - (3 × 5) = 85%
 */
export function getMaxColumnWidth(totalColumns: number): number {
	const spaceForOtherColumns = (totalColumns - 1) * COLUMN_MIN_WIDTH;
	return 100 - spaceForOtherColumns;
}

/**
 * Rounds and clamps a width value to the valid range [COLUMN_MIN_WIDTH, maxWidth].
 */
export function clampWidth(width: number, maxWidth: number): number {
	const rounded = Math.round(width);
	return Math.max(COLUMN_MIN_WIDTH, Math.min(rounded, maxWidth));
}

// ─── Internal Helpers ─────────────────────────────────────

interface ColumnWithIndex {
	col: ColumnEntity;
	index: number;
}

/**
 * Filters columns to only those that are editable (not frozen and not excluded).
 */
function getEditableColumns(
	columns: ColumnEntity[],
	frozenIds: Set<string>,
	excludeIndex?: number
): ColumnWithIndex[] {
	return columns
		.map((col, index) => ({ col, index }))
		.filter(({ col, index }) => {
			if (excludeIndex !== undefined && index === excludeIndex) return false;
			if (frozenIds.has(col.id)) return false;
			return true;
		});
}

// ─── Public Functions ─────────────────────────────────────

/**
 * Finds the widest editable column, excluding one by index.
 *
 * Used when updating a column's width — the widest sibling
 * "compensates" by absorbing the width difference.
 *
 * Returns null if no editable column exists.
 */
export function findWidestEditableColumn(
	columns: ColumnEntity[],
	excludeIndex: number,
	frozenIds: Set<string>
): ColumnWithIndex | null {
	const candidates = getEditableColumns(columns, frozenIds, excludeIndex);
	if (candidates.length === 0) return null;

	candidates.sort((a, b) => b.col.width - a.col.width);
	return candidates[0];
}

/**
 * Collects enough width from the widest editable columns to reach `widthNeeded`.
 *
 * Each column can give at most (its width − COLUMN_MIN_WIDTH).
 * Columns are drained from widest to narrowest.
 *
 * Used when ADDING a column — we "steal" width from existing ones.
 *
 * Returns the list of { index, newWidth } updates,
 * or null if there's not enough space.
 */
export function collectWidthFromColumns(
	columns: ColumnEntity[],
	widthNeeded: number,
	frozenIds: Set<string>
): Array<{ index: number; newWidth: number }> | null {
	const donors = getEditableColumns(columns, frozenIds)
		.filter(({ col }) => col.width > COLUMN_MIN_WIDTH)
		.sort((a, b) => b.col.width - a.col.width);

	let remaining = widthNeeded;
	const updates: Array<{ index: number; newWidth: number }> = [];

	for (const { col, index } of donors) {
		if (remaining <= 0) break;

		const canGive = col.width - COLUMN_MIN_WIDTH;
		const takes = Math.min(canGive, remaining);

		updates.push({ index, newWidth: col.width - takes });
		remaining -= takes;
	}

	if (remaining > 0) return null;

	return updates;
}

/**
 * Distributes `widthToDistribute` evenly across editable columns
 * (excluding the one being deleted).
 *
 * Uses integer division so the total stays exact:
 *   - Each column gets `floor(width / count)`
 *   - The first `remainder` columns get +1 extra
 *
 * Note: returned indexes are already adjusted for the deletion shift.
 *
 * Used when DELETING a column — we redistribute its width to siblings.
 */
export function distributeWidthToColumns(
	columns: ColumnEntity[],
	widthToDistribute: number,
	deletedIndex: number,
	frozenIds: Set<string>
): Array<{ index: number; newWidth: number }> {
	const recipients = getEditableColumns(columns, frozenIds, deletedIndex);
	if (recipients.length === 0) return [];

	const baseShare = Math.floor(widthToDistribute / recipients.length);
	const remainder = widthToDistribute - baseShare * recipients.length;

	return recipients.map(({ col, index }, i) => {
		const adjustedIndex = index > deletedIndex ? index - 1 : index;
		const extra = i < remainder ? 1 : 0;

		return {
			index: adjustedIndex,
			newWidth: col.width + baseShare + extra
		};
	});
}
