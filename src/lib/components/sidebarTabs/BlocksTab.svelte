<script lang="ts">
	import { draggable } from '$lib/dnd/adapter/attachments/draggable.svelte';
	import { getDndContext } from '$lib/dnd/adapter/contexts/dndContext.svelte';
	import { BLOCKS_CATALOG } from '$lib/template/data/blocksCatalog';
	import NodeRenderer from '$lib/template/nodes/shared/NodeRenderer.svelte';
	const dndContext = getDndContext();
</script>

<div class="panel">
	{#each BLOCKS_CATALOG as block (block.id)}
		<NodeRenderer
			entity={block}
			format="card"
			{@attach draggable({
				manager: dndContext.manager,
				id: block.id,
				data: { type: block.type, item: block }
			})}
		/>
	{/each}
</div>

<style>
	.panel {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: auto;
		gap: 4px;
	}
</style>
