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
	import {
		setHistoryContext,
		getHistoryContext
	} from '$lib/history/contexts/historyContext.svelte';
	import { AddRowCommand } from '$lib/commands/structures/rows/AddRowCommand';
	import { AddBlockCommand } from '$lib/commands/blocks/AddBlockCommand';
	import { MoveRowCommand } from '$lib/commands/structures/rows/MoveRowCommand';
	import { MoveBlockCommand } from '$lib/commands/blocks/MoveBlockCommand';
	import { buildTextExtensions } from '$lib/richtext/adapter/utils/buildExtensions';

	interface Props {
		template: TemplateEntity;
		children: Snippet;
	}
	const { template, children }: Props = $props();

	setTemplateContext(() => template);
	setUIContext();
	setClickOutsideContext();
	setDndContext();
	setHistoryContext();

	const templateStore = getTemplateContext();
	const historyService = getHistoryContext();
	setRichtextContext(buildTextExtensions(templateStore.template.config));

	const addRow = (row: RowEntity, index: number) => {
		const command = new AddRowCommand({
			store: templateStore,
			row,
			index
		});
		historyService.executeCommand(command, {
			type: 'row.add'
		});
	};

	const moveRow = (from: number, to: number) => {
		const command = new MoveRowCommand({
			store: templateStore,
			from,
			to
		});
		historyService.executeCommand(command, {
			type: 'row.move'
		});
	};

	const addBlock = (block: BlockEntity, coordinates: BlockCoordinates) => {
		const command = new AddBlockCommand({
			store: templateStore,
			block,
			coordinates
		});
		historyService.executeCommand(command, {
			type: 'block.add'
		});
	};

	const moveBlock = (from: BlockCoordinates, to: BlockCoordinates) => {
		const command = new MoveBlockCommand({
			store: templateStore,
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
			const from = templateStore.getRowCoordinates(draggable.id);
			let to = templateStore.getRowCoordinates(droppable.id);
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

		const from = templateStore.getBlockCoordinates(draggable.id);
		let to = templateStore.getBlockCoordinates(droppable.id);
		let columnCoordinates;
		if (!to) {
			columnCoordinates = templateStore.getColumnCoordinates(droppable.id);
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

	const dndStore = getDndContext();
	dndStore.manager.on('drop', handleDrop);

	onDestroy(() => {
		dndStore.manager.off('drop', handleDrop);
	});
</script>

{@render children()}

<DragOverlay>
	{#if dndStore.transferredData}
		<NodeRenderer entity={dndStore.transferredData} format="card" />
	{/if}
</DragOverlay>
