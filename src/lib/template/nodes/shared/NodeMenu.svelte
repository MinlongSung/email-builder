<script lang="ts">
	import { floating } from '$lib/floating-ui/adapter/attachments/floating.svelte';
	import { gap } from '$lib/floating-ui/adapter/middlewares/gap';
	import { flip } from '@floating-ui/dom';

	interface Props {
		referenceElement: HTMLElement;
		isHovered: boolean;
		onClone: () => void;
		onDelete: () => void;
		[key: string]: any;
	}
	const { referenceElement, isHovered, onClone, onDelete, ...props }: Props = $props();

	let menuAccess: HTMLElement | undefined = $state();
	let isMenuVisible = $state(false);
</script>

<div
	role="button"
	tabindex="0"
	onmouseover={(e) => {
		e.stopPropagation();
		isMenuVisible = true;
	}}
	onmouseleave={(e) => {
		e.stopPropagation();
		isMenuVisible = false;
	}}
	onfocus={(e) => {
		e.stopPropagation();
		isMenuVisible = true;
	}}
	bind:this={menuAccess}
	{@attach floating({
		referenceElement,
		isVisible: isHovered,
		options: {
			placement: 'right',
			middleware: [
				flip({
					fallbackPlacements: ['left']
				}),
				gap({ padding: 10 })
			]
		}
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
						})
					]
				}
			})}
		>
			<div class="menu">
				<button {...props}>Mover</button>
				<button
					onclick={(e) => {
						e.stopPropagation();
						onClone();
					}}
				>
					Clonar
				</button>
				<button
					onclick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
				>
					Borrar
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
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
