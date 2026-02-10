<script lang="ts">
	import { draggable } from '$lib/dnd/adapter/attachments/draggable.svelte';
	import { getDndContext } from '$lib/dnd/adapter/contexts/dndContext.svelte';
	import { ROWS_CATALOG } from '$lib/template/data/rowsCatalog';
	import NodeRenderer from '$lib/template/nodes/shared/NodeRenderer.svelte';
	
	const dndStore = getDndContext();
</script>

<div class="panel">
	{#each ROWS_CATALOG as row (row.id)}
		<NodeRenderer
			entity={row}
			format="card"
			{@attach draggable({
				manager: dndStore.manager,
				id: row.id,
				data: { type: row.type, item: row },
			})}
		/>
	{/each}
</div>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
