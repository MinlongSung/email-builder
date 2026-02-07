<script lang="ts">
	import { getDndContext } from '../contexts/dndContext.svelte';
	const { children } = $props();
	const dndContext = getDndContext();
</script>

{#if dndContext.isDragging}
	<div
		class="drag-overlay"
		style:transform="translate3d({dndContext.clientX}px, {dndContext.clientY}px, 0)"
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
