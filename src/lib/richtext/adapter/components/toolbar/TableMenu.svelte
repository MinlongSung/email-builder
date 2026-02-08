<script lang="ts">
	import { tableContextKey } from '$lib/richtext/core/extensions/nodes/table/plugins/tableContext';
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';
	import { floating } from '$lib/floating-ui/adapter/attachments/floating.svelte';
	import { arrow, flip, shift, offset } from '@floating-ui/dom';

	const richtextContext = getRichtextContext();
	const editor = $derived(richtextContext.activeEditor);
	const tableContext = $derived(editor?.state ? tableContextKey.getState(editor.state) : null);
	const tableElement = $derived(tableContext?.tableElement);

	let arrowElement = $state<HTMLElement>();
</script>

{#if tableElement}
	<div
		class="tableMenu"
		{@attach floating({
			referenceElement: tableElement,
            arrowElement,
			isVisible: true,
			options: {
				placement: 'top',
				middleware: [
					offset(8),
					flip({
						fallbackPlacements: ['top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end']
					}),
					shift({ padding: 8 }),
					...(arrowElement ? [arrow({ element: arrowElement })] : [])
				]
			}
		})}
	>
		<div class="menuContent">menu tabla</div>
		<div class="arrow" bind:this={arrowElement}></div>
	</div>
{/if}

<style>
	.tableMenu {
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 8px 12px;
        z-index: 2;
	}

	.menuContent {
		display: flex;
		gap: 8px;
		align-items: center;
		position: relative;
	}

	.arrow {
		position: absolute;
		width: 10px;
		height: 10px;
		background: white;
		transform: rotate(45deg);
	}
</style>
