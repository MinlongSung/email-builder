<script lang="ts">
	import { draggable } from '$lib/dnd/adapter/attachments/draggable.svelte';
	import { droppable } from '$lib/dnd/adapter/attachments/droppable.svelte';
	import DropIndicator from '$lib/dnd/adapter/components/DropIndicator.svelte';
	import DropPlaceholder from '$lib/dnd/adapter/components/DropPlaceholder.svelte';
	import { getDndContext } from '$lib/dnd/adapter/contexts/dndContext.svelte';
	import {
		BLOCK_TYPES,
		type BlockCoordinates,
		type ColumnEntity,
	} from '$lib/template/types';
	import NodeRenderer from '../../shared/NodeRenderer.svelte';
	import NodeWrapper from '../../shared/NodeWrapper.svelte';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { getHistoryContext } from '$lib/history/contexts/historyContext.svelte';
	import { CloneBlockCommand } from '$lib/commands/blocks/CloneBlockCommand';
	import { DeleteBlockCommand } from '$lib/commands/blocks/DeleteBlockCommand';

	interface Props {
		entity: ColumnEntity;
	}
	const { entity }: Props = $props();
	const dndStore = getDndContext();
	const templateStore = getTemplateContext();
	const historyService = getHistoryContext();

	const handleClone = (id: string) => {
		const coordinates = templateStore.getBlockCoordinates(id);
		if (!coordinates) return;
		const targetCoordinates: BlockCoordinates = {
			...coordinates,
			blockIndex: coordinates.blockIndex + 1
		};
		const command = new CloneBlockCommand({
			store: templateStore,
			sourceCoordinates: coordinates,
			targetCoordinates
		});
		historyService.executeCommand(command, {
			type: 'block.clone'
		});
	};

	const handleDelete = (id: string) => {
		const coordinates = templateStore.getBlockCoordinates(id);
		if (!coordinates) return;
		const command = new DeleteBlockCommand({
			store: templateStore,
			coordinates
		});
		historyService.executeCommand(command, {
			type: 'block.delete'
		});
	};
</script>

<table
	width="100%"
	{@attach droppable({
		manager: dndStore.manager,
		id: entity.id,
		data: { accepts: BLOCK_TYPES }
	})}
>
	<tbody>
		{#each entity.blocks as block (block.id)}
			<tr>
				<td
					style:position="relative"
					style:opacity={dndStore.isDragging && dndStore.draggableId === block.id ? 0.7 : 1}
				>
					<NodeWrapper
						entity={block}
						{@attach draggable({
							manager: dndStore.manager,
							id: block.id,
							data: { type: block.type, item: block }
						})}
						onClone={() => handleClone(block.id)}
						onDelete={() => handleDelete(block.id)}
					>
						<NodeRenderer
							entity={block}
							{@attach droppable({
								manager: dndStore.manager,
								id: block.id,
								data: { accepts: BLOCK_TYPES }
							})}
						/>
					</NodeWrapper>

					{#if dndStore.isDragging && dndStore.droppableId === block.id && dndStore.draggableId !== dndStore.droppableId}
						<DropIndicator isTopHalf={dndStore.isTopHalf} />
					{/if}
				</td>
			</tr>
		{:else}
			<tr>
				<td>
					<DropPlaceholder isOver={entity.id === dndStore.droppableId} />
				</td>
			</tr>
		{/each}
	</tbody>
</table>
