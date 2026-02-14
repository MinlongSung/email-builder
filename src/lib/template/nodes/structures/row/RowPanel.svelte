<script lang="ts">
	import { draggable } from '$lib/dnd/adapter/attachments/draggable.svelte';
	import { droppable } from '$lib/dnd/adapter/attachments/droppable.svelte';
	import { scrollable } from '$lib/dnd/adapter/attachments/scrollable.svelte';
	import DropIndicator from '$lib/dnd/adapter/components/DropIndicator.svelte';
	import { DndStore } from '$lib/dnd/adapter/contexts/dndContext.svelte';
	import type { DndState } from '$lib/dnd/core/types';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { getHistoryContext } from '$lib/history/contexts/historyContext.svelte';
	import { MoveColumnCommand } from '$lib/commands/structures/columns/MoveColumnCommand';
	import { COLUMN_TYPES, type RowEntity } from '$lib/template/types';
	import { onDestroy } from 'svelte';

	interface Props {
		entity: RowEntity;
	}
	const { entity }: Props = $props();

	const dndStore = new DndStore();
	const templateStore = getTemplateContext();
	const historyService = getHistoryContext();

	const moveColumn = (rowIndex: number, from: number, to: number) => {
		const command = new MoveColumnCommand({
			store: templateStore,
			rowIndex,
			from,
			to
		});

		historyService.executeCommand(command, {
			type: 'column.move'
		});
	};
	
	const handleDrop = ({ draggable, droppable, isTopHalf }: DndState) => {
		if (!draggable || !droppable) return;

		const fromCoordinates = templateStore.getColumnCoordinates(draggable.id);
		const toCoordinates = templateStore.getColumnCoordinates(droppable.id);
		if (!fromCoordinates || !toCoordinates) return;

		const rowIndex = fromCoordinates.rowIndex;
		const from = fromCoordinates.columnIndex;
		let to = toCoordinates.columnIndex;

		to += isTopHalf ? 0 : 1;
		if (from < to) to -= 1;
		if (from === to) return;
		moveColumn(rowIndex, from, to);
	};

	dndStore.manager.on('drop', handleDrop);
	onDestroy(() => {
		dndStore.manager.off('drop', handleDrop);
	});
</script>

<div {@attach scrollable({ manager: dndStore.manager, id: entity.id })}>
	{#each entity.columns as column (column.id)}
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
			{column.id}

			{#if dndStore.isDragging && dndStore.droppableId === column.id && dndStore.draggableId !== dndStore.droppableId}
				<DropIndicator isTopHalf={dndStore.isTopHalf} />
			{/if}
		</div>
	{/each}
</div>

<style>
</style>
