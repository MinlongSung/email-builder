<script lang="ts">
	import { getDndContext } from '../contexts/dndContext.svelte';
	const { children } = $props();
	const dndStore = getDndContext();
</script>

{#if dndStore.isDragging}
	<div
		class="drag-overlay"
		style:transform="translate3d({dndStore.clientX}px, {dndStore.clientY}px, 0)"
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.drag-overlay {
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 9999;
		opacity: 0.7;
	}
</style>
