<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import {
		ROW_TYPES,
		type BlockCoordinates,
		type BlockEntity,
		type RowEntity,
		type TemplateEntity
	} from '$lib/template/types';
	import {
		getTemplateContext,
		setTemplateContext
	} from '$lib/template/contexts/templateContext.svelte';
	import { getDndContext, setDndContext } from '$lib/dnd/adapter/contexts/dndContext.svelte';
	import type { DndState } from '$lib/dnd/core/types';
	import DragOverlay from '$lib/dnd/adapter/components/DragOverlay.svelte';
	import NodeRenderer from '$lib/template/nodes/shared/NodeRenderer.svelte';
	import { setRichtextContext } from '$lib/richtext/adapter/contexts/richtextContext.svelte';
	import { setUIContext } from '$lib/template/contexts/uiContext.svelte';
	import { setClickOutsideContext } from '$lib/clickOutside/contexts/clickOutsideContext.svelte';
	import { historyService } from '$lib/commands/history/HistoryService.svelte';
	import { AddRowCommand } from '$lib/commands/structures/rows/AddRowCommand';
	import { AddBlockCommand } from '$lib/commands/blocks/AddBlockCommand';
	import { MoveRowCommand } from '$lib/commands/structures/rows/MoveRowCommand';
	import { MoveBlockCommand } from '$lib/commands/blocks/MoveBlockCommand';

	interface Props {
		template: TemplateEntity;
		children: Snippet;
	}
	const { template, children }: Props = $props();

	setTemplateContext(() => template);
	setRichtextContext();
	setUIContext();
	setClickOutsideContext();
	setDndContext();

	const templateContext = getTemplateContext();
	
	const addRow = (row: RowEntity, index: number) => {
		const command = new AddRowCommand({
			store: templateContext,
			row,
			index
		});
		historyService.executeCommand(command, {
			type: 'row.add'
		});
	};

	const moveRow = (from: number, to: number) => {
		const command = new MoveRowCommand({
			store: templateContext,
			from,
			to
		});
		historyService.executeCommand(command, {
			type: 'row.move'
		});
	};

	const addBlock = (block: BlockEntity, coordinates: BlockCoordinates) => {
		const command = new AddBlockCommand({
			store: templateContext,
			block,
			coordinates
		});
		historyService.executeCommand(command, {
			type: 'block.add'
		});
	};

	const moveBlock = (from: BlockCoordinates, to: BlockCoordinates) => {
		const command = new MoveBlockCommand({
			store: templateContext,
			from,
			to
		});
		historyService.executeCommand(command, {
			type: 'block.move'
		});
	};

	const handleDrop = ({ draggable, droppable, isTopHalf }: DndState) => {
		if (!draggable || !droppable) return;

		if (ROW_TYPES.includes(draggable?.data.type)) {
			const from = templateContext.getRowCoordinates(draggable.id);
			let to = templateContext.getRowCoordinates(droppable.id);
			if (from !== undefined) {
				if (to === undefined) return;

				to += isTopHalf ? 0 : 1;
				if (from < to) to -= 1;
				if (from === to) return;
				moveRow(from, to);
				return;
			}

			if (to === undefined) to = 0;
			addRow(draggable.data.item as RowEntity, to + (isTopHalf ? 0 : 1));
			return;
		}

		const from = templateContext.getBlockCoordinates(draggable.id);
		let to = templateContext.getBlockCoordinates(droppable.id);
		let columnCoordinates;
		if (!to) {
			columnCoordinates = templateContext.getColumnCoordinates(droppable.id);
			if (!columnCoordinates) return;
			to = { ...columnCoordinates, blockIndex: 0 };
		}
		if (from) {
			const sameColumn = from.rowIndex === to.rowIndex && from.columnIndex === to.columnIndex;
			to.blockIndex += isTopHalf || columnCoordinates ? 0 : 1;
			if (sameColumn && from.blockIndex < to.blockIndex) to.blockIndex -= 1;
			if (sameColumn && from.blockIndex === to.blockIndex) return;
			moveBlock(from, to);
			return;
		}

		to.blockIndex += isTopHalf || columnCoordinates ? 0 : 1;
		addBlock(draggable.data.item as BlockEntity, to);
	};

	const dndContext = getDndContext();
	dndContext.manager.on('drop', handleDrop);

	onDestroy(() => {
		dndContext.manager.off('drop', handleDrop);
	});
</script>

{@render children()}

<DragOverlay>
	{#if dndContext.transferredData}
		<NodeRenderer entity={dndContext.transferredData} format="card" />
	{/if}
</DragOverlay>
