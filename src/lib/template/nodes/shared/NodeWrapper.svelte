<script lang="ts">
	import { getDndContext } from '$lib/dnd/adapter/contexts/dndContext.svelte';
	import { floating } from '$lib/floating-ui/adapter/attachments/floating.svelte';
	import { gap } from '$lib/floating-ui/adapter/middlewares/gap';
	import { getUIContext } from '$lib/template/contexts/uiContext.svelte';
	import { type BlockEntity, type RowEntity } from '$lib/template/types';
	import { flip } from '@floating-ui/dom';
	import type { Snippet } from 'svelte';

	interface Props {
		entity: BlockEntity | RowEntity;
		onClone: () => void;
		onDelete: () => void;
		children: Snippet;
	}
	const { entity, children, onClone, onDelete, ...props }: Props = $props();

	const uiContext = getUIContext();
	const dndContext = getDndContext();
	const isDragging = $derived(dndContext.isDragging);
	const isSelected = $derived(!isDragging && uiContext.selectedId === entity.id);
	const isHovered = $derived(!isDragging && uiContext.hoveredId === entity.id);

	let referenceEl: HTMLElement | undefined = $state();
	let menuAccess: HTMLElement | undefined = $state();
	let isMenuVisible = $state(false);
</script>

<div bind:this={referenceEl} class:selected={isSelected} class:hovered={isHovered}>
	{@render children()}

	{#if referenceEl}
		<div
			bind:this={menuAccess}
			{@attach floating({
				referenceElement: referenceEl,
				isVisible: isHovered,
				options: {
					placement: 'right',
					middleware: [
						flip({
							fallbackPlacements: ['left']
						}),
						gap({ padding: 10 })
					]
				},
				onClick: () => (uiContext.selectedId = entity.id),
				onMouseOver: () => (uiContext.hoveredId = entity.id),
				onMouseLeave: () => (uiContext.hoveredId = null)
			})}
			style:z-index="1"
		>
			<div class="menuAccess">⋮</div>
			{#if menuAccess}
				<div
					{@attach floating({
						referenceElement: menuAccess,
						isVisible: isMenuVisible,
						options: {
							placement: 'bottom-end',
							middleware: [
								flip({
									fallbackPlacements: ['bottom-start', 'top-start', 'top-end', 'left']
								}),
							]
						},
						onMouseOver: () => (isMenuVisible = true),
						onMouseLeave: () => (isMenuVisible = false)
					})}
				>
					<div class="menu">
						<button {...props}>Mover</button>
						<button onclickcapture={onClone}>Clonar</button>
						<button onclickcapture={onDelete}>Borrar</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.selected {
		outline: 1px solid red;
	}
	.hovered {
		outline: 1px solid purple;
	}

	.menuAccess {
		padding: 10px 15px;
		background-color: lightgreen;
	}

	.menu {
		border: 3px solid red;
		background-color: white;
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 4px;
		min-width: 120px;
	}
	.menu button {
		background: none;
		border: none;
		padding: 6px 12px;
		text-align: left;
		cursor: pointer;
		border-radius: 2px;
		font-size: 14px;
		color: #333;
	}
	.menu button:hover {
		background-color: #f0f0f0;
	}
</style>
