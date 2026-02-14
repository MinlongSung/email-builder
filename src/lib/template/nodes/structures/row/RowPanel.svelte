<script lang="ts">
	// ─── Imports ──────────────────────────────────────────
	import { onDestroy } from 'svelte';
	import { draggable } from '$lib/dnd/adapter/attachments/draggable.svelte';
	import { droppable } from '$lib/dnd/adapter/attachments/droppable.svelte';
	import { scrollable } from '$lib/dnd/adapter/attachments/scrollable.svelte';
	import DropIndicator from '$lib/dnd/adapter/components/DropIndicator.svelte';
	import { DndStore } from '$lib/dnd/adapter/contexts/dndContext.svelte';
	import type { DndState } from '$lib/dnd/core/types';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { getHistoryContext } from '$lib/history/contexts/historyContext.svelte';
	import { MoveColumnCommand } from '$lib/commands/structures/columns/MoveColumnCommand';
	import { UpdateColumnCommand } from '$lib/commands/structures/columns/UpdateColumnCommand';
	import { AddColumnCommand } from '$lib/commands/structures/columns/AddColumnCommand';
	import { DeleteColumnCommand } from '$lib/commands/structures/columns/DeleteColumnCommand';
	import { BatchCommand } from '$lib/commands/BatchCommands';
	import { UpdateRowCommand } from '$lib/commands/structures/rows/UpdateRowCommand';
	import { COLUMN_TYPES, type ColumnEntity, type RowEntity } from '$lib/template/types';
	import { generateId } from '$lib/template/utils/generateId';
	import { debounce } from '$lib/template/utils/debounce';
	import {
		COLUMN_MIN_WIDTH,
		getMaxColumnWidth,
		clampWidth,
		findWidestEditableColumn,
		collectWidthFromColumns,
		distributeWidthToColumns,
		COLUMN_WIDTH_STEP
	} from '$lib/template/nodes/utils/columnWidth';
	import { SvelteSet } from 'svelte/reactivity';
	import DragOverlay from '$lib/dnd/adapter/components/DragOverlay.svelte';
	import PaddingControl from '$lib/components/ui/PaddingControl.svelte';
	import NodeRenderer from '../../shared/NodeRenderer.svelte';

	// ─── Props ────────────────────────────────────────────
	interface Props {
		entity: RowEntity;
	}
	const { entity = $bindable() }: Props = $props();

	// ─── Contexts & Stores ────────────────────────────────
	const templateStore = getTemplateContext();
	const historyService = getHistoryContext();
	const dndStore = new DndStore();

	// ─── Frozen Columns State ─────────────────────────────
	// Frozen columns keep their width fixed during width edits.
	let frozenColumns = new SvelteSet<string>();

	function toggleFreeze(columnId: string) {
		if (frozenColumns.has(columnId)) frozenColumns.delete(columnId);
		else frozenColumns.add(columnId);
	}

	// ─── Derived Values ───────────────────────────────────
	const unfrozenCount = $derived(entity.columns.filter((col) => !frozenColumns.has(col.id)).length);

	const canAddColumn = $derived(
		entity.columns.some((col) => col.width > COLUMN_MIN_WIDTH && !frozenColumns.has(col.id))
	);

	const maxWidth = $derived(getMaxColumnWidth(entity.columns.length));

	// ─── Helpers ──────────────────────────────────────────
	function getRowIndex(): number | undefined {
		return templateStore.getRowCoordinates(entity.id);
	}

	function canEditWidth(columnId: string): boolean {
		if (frozenColumns.has(columnId)) return false;
		if (entity.columns.length <= 1) return false;
		if (unfrozenCount <= 1) return false;
		return true;
	}

	function canStepWidth(columnIndex: number, step: number): boolean {
		const column = entity.columns[columnIndex];
		if (!canEditWidth(column.id)) return false;

		const targetWidth = column.width + step;
		if (targetWidth < COLUMN_MIN_WIDTH || targetWidth > maxWidth) return false;

		const compensator = findWidestEditableColumn(entity.columns, columnIndex, frozenColumns);
		if (!compensator) return false;

		return compensator.col.width - step >= COLUMN_MIN_WIDTH;
	}

	// ─── Column Operations ────────────────────────────────
	function addColumn() {
		const rowIndex = getRowIndex();
		if (rowIndex === undefined) return;

		const widthUpdates = collectWidthFromColumns(entity.columns, COLUMN_MIN_WIDTH, frozenColumns);
		if (!widthUpdates) return;

		const newColumn: ColumnEntity = {
			id: generateId(),
			type: 'column',
			width: COLUMN_MIN_WIDTH,
			blocks: []
		};

		const batch = new BatchCommand();

		for (const { index, newWidth } of widthUpdates) {
			batch.add(
				new UpdateColumnCommand({
					store: templateStore,
					rowIndex,
					columnIndex: index,
					updates: { width: newWidth }
				})
			);
		}

		batch.add(
			new AddColumnCommand({
				store: templateStore,
				rowIndex,
				column: newColumn,
				columnIndex: entity.columns.length
			})
		);

		historyService.executeCommand(batch, { type: 'column.add' });
	}

	function deleteColumn(columnIndex: number) {
		const rowIndex = getRowIndex();
		if (rowIndex === undefined) return;

		const deletedWidth = entity.columns[columnIndex].width;

		const widthUpdates = distributeWidthToColumns(
			entity.columns,
			deletedWidth,
			columnIndex,
			frozenColumns
		);
		if (widthUpdates.length === 0) return;

		const batch = new BatchCommand();

		batch.add(
			new DeleteColumnCommand({
				store: templateStore,
				rowIndex,
				columnIndex
			})
		);

		for (const { index, newWidth } of widthUpdates) {
			batch.add(
				new UpdateColumnCommand({
					store: templateStore,
					rowIndex,
					columnIndex: index,
					updates: { width: newWidth }
				})
			);
		}

		historyService.executeCommand(batch, { type: 'column.delete' });
	}

	const debouncedUpdateColumnWidth = debounce(updateColumnWidth, 300);

	function updateColumnWidth(columnIndex: number, rawWidth: number) {
		const rowIndex = getRowIndex();
		if (rowIndex === undefined) return;

		const currentColumn = entity.columns[columnIndex];
		if (!canEditWidth(currentColumn.id)) return;

		const newWidth = clampWidth(rawWidth, maxWidth);
		const widthDelta = newWidth - currentColumn.width;
		if (widthDelta === 0) return;

		const compensator = findWidestEditableColumn(entity.columns, columnIndex, frozenColumns);
		if (!compensator) return;

		const compensatorNewWidth = compensator.col.width - widthDelta;
		if (compensatorNewWidth < COLUMN_MIN_WIDTH) return;

		const batch = new BatchCommand();

		batch.add(
			new UpdateColumnCommand({
				store: templateStore,
				rowIndex,
				columnIndex,
				updates: { width: newWidth }
			})
		);

		batch.add(
			new UpdateColumnCommand({
				store: templateStore,
				rowIndex,
				columnIndex: compensator.index,
				updates: { width: compensatorNewWidth }
			})
		);

		historyService.executeCommand(batch, { type: 'column.update' });
	}

	// ─── Row Operations ──────────────────────────────────
	const SEPARATOR_STEP = 5;
	const SEPARATOR_MIN = 0;
	const SEPARATOR_MAX = 50;

	function updateSeparatorSize(newSize: number) {
		const rowIndex = getRowIndex();
		if (rowIndex === undefined) return;

		const clamped = Math.max(SEPARATOR_MIN, Math.min(Math.round(newSize), SEPARATOR_MAX));
		if (clamped === entity.separatorSize) return;

		historyService.executeCommand(
			new UpdateRowCommand({
				store: templateStore,
				rowIndex,
				updates: { separatorSize: clamped }
			}),
			{ type: 'row.update' }
		);
	}

	const debouncedUpdateSeparatorSize = debounce(updateSeparatorSize, 300);

	// ─── Padding ─────────────────────────────────────────
	function parsePadding(style?: Record<string, string | number>): [number, number, number, number] {
		const raw = style?.padding;
		if (!raw || typeof raw !== 'string') return [0, 0, 0, 0];

		const parts = raw.split(/\s+/).map((v) => parseInt(v, 10) || 0);
		if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
		if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
		if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
		return [parts[0], parts[1], parts[2], parts[3]];
	}

	const paddingValues = $derived(parsePadding(entity.style));

	function handlePaddingChange(values: [number, number, number, number]) {
		const rowIndex = getRowIndex();
		if (rowIndex === undefined) return;

		const padding = `${values[0]}px ${values[1]}px ${values[2]}px ${values[3]}px`;

		historyService.executeCommand(
			new UpdateRowCommand({
				store: templateStore,
				rowIndex,
				updates: { style: { ...entity.style, padding } }
			}),
			{ type: 'row.update' }
		);
	}

	function toggleResponsive() {
		const rowIndex = getRowIndex();
		if (rowIndex === undefined) return;

		new UpdateRowCommand({
			store: templateStore,
			rowIndex,
			updates: { isResponsive: !entity.isResponsive }
		}).execute();
	}

	function moveColumn(rowIndex: number, fromIndex: number, toIndex: number) {
		historyService.executeCommand(
			new MoveColumnCommand({
				store: templateStore,
				rowIndex,
				from: fromIndex,
				to: toIndex
			}),
			{ type: 'column.move' }
		);
	}

	// ─── Drag & Drop ─────────────────────────────────────
	function handleDrop({ draggable, droppable, isTopHalf }: DndState) {
		if (!draggable || !droppable) return;

		const fromCoords = templateStore.getColumnCoordinates(draggable.id);
		const toCoords = templateStore.getColumnCoordinates(droppable.id);
		if (!fromCoords || !toCoords) return;

		const from = fromCoords.columnIndex;
		let to = toCoords.columnIndex + (isTopHalf ? 0 : 1);
		if (from < to) to -= 1;
		if (from === to) return;

		moveColumn(fromCoords.rowIndex, from, to);
	}

	dndStore.manager.on('drop', handleDrop);
	onDestroy(() => dndStore.manager.off('drop', handleDrop));
</script>

<div>
	<label>
		Responsive:
		<input type="checkbox" checked={entity.isResponsive} onchange={toggleResponsive} />
	</label>
</div>

<label>
	Separator (px):
	<button
		onclick={() => updateSeparatorSize(entity.separatorSize - SEPARATOR_STEP)}
		disabled={entity.separatorSize - SEPARATOR_STEP < SEPARATOR_MIN}
	>
		-{SEPARATOR_STEP}
	</button>
	<input
		type="number"
		min={SEPARATOR_MIN}
		max={SEPARATOR_MAX}
		step="1"
		value={entity.separatorSize}
		oninput={(e) => debouncedUpdateSeparatorSize(+e.currentTarget.value)}
	/>
	<button
		onclick={() => updateSeparatorSize(entity.separatorSize + SEPARATOR_STEP)}
		disabled={entity.separatorSize + SEPARATOR_STEP > SEPARATOR_MAX}
	>
		+{SEPARATOR_STEP}
	</button>
</label>

<PaddingControl values={paddingValues} onchange={handlePaddingChange} />

<div {@attach scrollable({ manager: dndStore.manager, id: entity.id })}>
	<button onclick={addColumn} disabled={!canAddColumn}> Add Column </button>

	{#each entity.columns as column, index (column.id)}
		<div
			style:position="relative"
			{@attach draggable({
				manager: dndStore.manager,
				id: column.id,
				data: { type: column.type, item: column }
			})}
			{@attach droppable({
				manager: dndStore.manager,
				id: column.id,
				data: { accepts: COLUMN_TYPES }
			})}
		>
			<div>
				{column.id}
			</div>

			<div>
				<label>
					<input
						type="checkbox"
						checked={frozenColumns.has(column.id)}
						onchange={() => toggleFreeze(column.id)}
					/>
					Freeze
				</label>

				<label>
					Width (%):
					<button
						onclick={() => updateColumnWidth(index, column.width - COLUMN_WIDTH_STEP)}
						disabled={!canStepWidth(index, -COLUMN_WIDTH_STEP)}
					>
						-{COLUMN_WIDTH_STEP}
					</button>
					<input
						type="number"
						min={COLUMN_MIN_WIDTH}
						max={maxWidth}
						step="1"
						value={column.width}
						disabled={!canStepWidth(index, 1) && !canStepWidth(index, -1)}
						oninput={(e) => debouncedUpdateColumnWidth(index, +e.currentTarget.value)}
					/>
					<button
						onclick={() => updateColumnWidth(index, column.width + COLUMN_WIDTH_STEP)}
						disabled={!canStepWidth(index, COLUMN_WIDTH_STEP)}
					>
						+{COLUMN_WIDTH_STEP}
					</button>
				</label>

				<button
					onclick={(e) => {
						e.stopPropagation();
						deleteColumn(index);
					}}
					disabled={entity.columns.length <= 1}
				>
					Delete
				</button>
			</div>

			{#if dndStore.isDragging && dndStore.droppableId === column.id && dndStore.draggableId !== dndStore.droppableId}
				<DropIndicator isTopHalf={dndStore.isTopHalf} />
			{/if}
		</div>
	{/each}
</div>

<DragOverlay store={dndStore}>
	{#if dndStore.transferredData}
		<NodeRenderer entity={dndStore.transferredData} format="card" />
	{/if}
</DragOverlay>
