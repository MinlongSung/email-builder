<script lang="ts">
	import { draggable } from '$lib/dnd/adapter/attachments/draggable.svelte';
	import { droppable } from '$lib/dnd/adapter/attachments/droppable.svelte';
	import DropIndicator from '$lib/dnd/adapter/components/DropIndicator.svelte';
	import DropPlaceholder from '$lib/dnd/adapter/components/DropPlaceholder.svelte';
	import { getDndContext } from '$lib/dnd/adapter/contexts/dndContext.svelte';
	import { ROW_TYPES, type RootEntity } from '$lib/template/types';
	import NodeRenderer from '../../shared/NodeRenderer.svelte';
	import NodeWrapper from '../../shared/NodeWrapper.svelte';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { getHistoryContext } from '$lib/history/contexts/historyContext.svelte';
	import { CloneRowCommand } from '$lib/commands/structures/rows/CloneRowCommand';
	import { DeleteRowCommand } from '$lib/commands/structures/rows/DeleteRowCommand';
	import { stringifyCssObject } from '$lib/template/utils/stringifyCssObject';

	interface Props {
		entity: RootEntity;
	}
	const { entity }: Props = $props();
	const dndStore = getDndContext();
	const templateStore = getTemplateContext();
	const historyService = getHistoryContext();

	const handleClone = (id: string) => {
		const index = templateStore.getRowCoordinates(id);
		if (index === undefined) return;
		const command = new CloneRowCommand({
			store: templateStore,
			sourceIndex: index,
			targetIndex: index + 1
		});
		historyService.executeCommand(command, {
			type: 'row.clone'
		});
	};

	const handleDelete = (id: string) => {
		const index = templateStore.getRowCoordinates(id);
		if (index === undefined) return;
		const command = new DeleteRowCommand({
			store: templateStore,
			index
		});
		historyService.executeCommand(command, {
			type: 'row.delete'
		});
	};

	const width = $derived(entity.width);
	const style = $derived(stringifyCssObject(entity.style));
</script>

<table
	{width}
	{style}
	{@attach droppable({
		manager: dndStore.manager,
		id: entity.id,
		data: { accepts: ROW_TYPES }
	})}
>
	<tbody>
		{#each entity.rows as row (row.id)}
			<tr>
				<td
					style:position="relative"
					style:opacity={dndStore.isDragging && dndStore.draggableId === row.id ? 0.7 : 1}
				>
					<NodeWrapper
						entity={row}
						{@attach draggable({
							manager: dndStore.manager,
							id: row.id,
							data: { type: row.type, item: row }
						})}
						onClone={() => handleClone(row.id)}
						onDelete={() => handleDelete(row.id)}
					>
						<NodeRenderer
							entity={row}
							{@attach droppable({
								manager: dndStore.manager,
								id: row.id,
								data: { accepts: ROW_TYPES }
							})}
						/>
					</NodeWrapper>

					{#if dndStore.isDragging && dndStore.droppableId === row.id && dndStore.draggableId !== dndStore.droppableId}
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
