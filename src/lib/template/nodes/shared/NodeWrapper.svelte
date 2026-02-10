<script lang="ts">
	import { getDndContext } from '$lib/dnd/adapter/contexts/dndContext.svelte';
	import { getUIContext } from '$lib/template/contexts/uiContext.svelte';
	import { type BlockEntity, type RowEntity } from '$lib/template/types';
	import type { Snippet } from 'svelte';
	import NodeMenu from './NodeMenu.svelte';

	interface Props {
		entity: BlockEntity | RowEntity;
		onClone: () => void;
		onDelete: () => void;
		children: Snippet;
	}
	const { entity, children, onClone, onDelete, ...props }: Props = $props();

	const uiStore = getUIContext();
	const dndStore = getDndContext();
	const isDragging = $derived(dndStore.isDragging);
	const isSelected = $derived(!isDragging && uiStore.selectedId === entity.id);
	const isHovered = $derived(!isDragging && uiStore.hoveredId === entity.id);

	let referenceEl: HTMLElement | undefined = $state();
</script>

<div
	bind:this={referenceEl}
	class:selected={isSelected}
	class:hovered={isHovered}
	onclick={(e) => {
		e.stopPropagation();
		uiStore.selectedId = entity.id;
	}}
	role="button"
	tabindex="0"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.stopPropagation();
			uiStore.selectedId = entity.id;
		}
	}}
	onmouseover={(e) => {
		e.stopPropagation();
		uiStore.hoveredId = entity.id;
	}}
	onmouseleave={(e) => {
		e.stopPropagation();
		uiStore.hoveredId = null;
	}}
	onfocus={(e) => {
		e.stopPropagation();
		uiStore.hoveredId = entity.id;
	}}
>
	{@render children()}

	{#if referenceEl}
		<NodeMenu referenceElement={referenceEl} {isHovered} {onClone} {onDelete} {...props} />
	{/if}
</div>

<style>
	.selected {
		outline: 1px solid red;
	}
	.hovered {
		outline: 1px solid purple;
	}
</style>
