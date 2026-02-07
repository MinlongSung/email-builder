<script lang="ts">
	import { scrollable } from '$lib/dnd/adapter/attachments/scrollable.svelte';
	import NodeRenderer from '$lib/template/nodes/shared/NodeRenderer.svelte';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { getDndContext } from '$lib/dnd/adapter/contexts/dndContext.svelte';

	const templateContext = getTemplateContext();
	const dndContext = getDndContext();
</script>

<main class="canvas" {@attach scrollable({ manager: dndContext.manager, id: 'canvas' })}>
	<NodeRenderer entity={templateContext.template.root} />
</main>

<style>
	.canvas {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		overflow: auto;
		padding: 50px;
	}
</style>
