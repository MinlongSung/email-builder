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
	import { historyService } from '$lib/commands/history/HistoryService.svelte';
	import { CloneRowCommand } from '$lib/commands/structures/CloneRowCommand';
	import { DeleteRowCommand } from '$lib/commands/structures/DeleteRowCommand';

	interface Props {
		entity: RootEntity;
	}
	const { entity }: Props = $props();
	const dndContext = getDndContext();
	const templateContext = getTemplateContext();

	const handleClone = (id: string) => {
		const index = templateContext.getRowCoordinates(id);
		if (index === undefined) return;
		const command = new CloneRowCommand({
			store: templateContext,
			sourceIndex: index,
			targetIndex: index + 1
		});
		historyService.executeCommand(command, {
			type: 'row.clone'
		});
	};

	const handleDelete = (id: string) => {
		const index = templateContext.getRowCoordinates(id);
		if (index === undefined) return;
		const command = new DeleteRowCommand({
			store: templateContext,
			index
		});
		historyService.executeCommand(command, {
			type: 'row.delete'
		});
	};
</script>

<table
	width={entity.width}
	{@attach droppable({
		manager: dndContext.manager,
		id: entity.id,
		data: { accepts: ROW_TYPES }
	})}
>
	<tbody>
		{#each entity.rows as row (row.id)}
			<tr>
				<td
					style:position="relative"
					style:opacity={dndContext.isDragging && dndContext.draggableId === row.id ? 0.7 : 1}
				>
					<NodeWrapper
						entity={row}
						{@attach draggable({
							manager: dndContext.manager,
							id: row.id,
							data: { type: row.type, item: row }
						})}
						onClone={() => handleClone(row.id)}
						onDelete={() => handleDelete(row.id)}
					>
						<NodeRenderer
							entity={row}
							{@attach droppable({
								manager: dndContext.manager,
								id: row.id,
								data: { accepts: ROW_TYPES }
							})}
						/>
					</NodeWrapper>

					{#if dndContext.isDragging && dndContext.droppableId === row.id && dndContext.draggableId !== dndContext.droppableId}
						<DropIndicator isTopHalf={dndContext.isTopHalf} />
					{/if}
				</td>
			</tr>
		{:else}
			<tr>
				<td>
					<DropPlaceholder isOver={entity.id === dndContext.droppableId} />
				</td>
			</tr>
		{/each}
	</tbody>
</table>
