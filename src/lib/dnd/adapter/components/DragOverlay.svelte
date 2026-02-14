<script lang="ts">
	import type { DndStore } from '../contexts/dndContext.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		store: DndStore;
		children?: Snippet;
	}
	const { store, children }: Props = $props();
</script>

{#if store.isDragging}
	<div
		class="drag-overlay"
		style:transform="translate3d({store.clientX}px, {store.clientY}px, 0)"
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
