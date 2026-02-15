<script lang="ts">
	import { tableContextKey } from '$lib/richtext/core/extensions/nodes/table/plugins/tableContext';
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';
	import { floating } from '$lib/floating-ui/adapter/attachments/floating.svelte';
	import { arrow, flip, offset } from '@floating-ui/dom';
	import { cellSelectionPluginKey } from '$lib/richtext/core/extensions/nodes/table/plugins/cellSelection';
	import ColorPicker from '$lib/components/ui/colorPicker/ColorPicker.svelte';

	const richtextContext = getRichtextContext();
	const editor = $derived(richtextContext.activeEditor);
	const tableContext = $derived(editor?.state ? tableContextKey.getState(editor.state) : null);
	const tableSelection = $derived(
		editor?.state ? cellSelectionPluginKey.getState(editor.state) : null
	);
	const cellAttrs = $derived(tableSelection?.cellAttrs);
	const tableElement = $derived(tableContext?.tableElement);

	let backgroundColor = $derived(cellAttrs?.backgroundColor || '#ffffff');
	let border = $derived(cellAttrs?.border || { width: '1px', style: 'solid', color: '#000000' });
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
					...(arrowElement ? [arrow({ element: arrowElement })] : [])
				]
			}
		})}
	>
		<div class="menuContent">
			<button onclick={() => editor?.commands.addRowBefore()}>+ Row ↑</button>
			<button onclick={() => editor?.commands.addRowAfter()}>+ Row ↓</button>
			<button onclick={() => editor?.commands.addColumnBefore()}>+ Col ←</button>
			<button onclick={() => editor?.commands.addColumnAfter()}>+ Col →</button>
			<button onclick={() => editor?.commands.deleteRow()}>- Row</button>
			<button onclick={() => editor?.commands.deleteColumn()}>- Col</button>
			<button onclick={() => editor?.commands.mergeCells()} disabled={!editor?.can().mergeCells()}>
				⬌ Merge
			</button>
			<button onclick={() => editor?.commands.splitCell()} disabled={!editor?.can().splitCell()}>
				⬍ Split
			</button>

			<ColorPicker
				value={backgroundColor}
				onchange={(color) => editor?.commands.setCellAttribute('backgroundColor', color)}
			/>

			<button
				onclick={() => {
					if (border.width > 1) {
						editor?.commands.setCellAttribute('border', {
							...border,
							width: `${border.width - 1}px`
						});
					}
				}}>-</button
			>
			<input
				type="number"
				value={parseInt(border.width)}
				onchange={(e) => {
					const value = e.currentTarget.value || '1';
					editor?.commands.setCellAttribute('border', {
						...border,
						width: `${value}px`
					});
				}}
				min="0"
			/>
			<button
				onclick={() => {
					editor?.commands.setCellAttribute('border', {
						...border,
						width: `${border.width + 1}px`
					});
				}}>+</button
			>

			<select
				value={border.style}
				onchange={(e) => {
					editor?.commands.setCellAttribute('border', {
						...border,
						style: e.currentTarget.value
					});
				}}
			>
				<option value="solid">—</option>
				<option value="dashed">- -</option>
				<option value="dotted">···</option>
				<option value="double">═</option>
				<option value="none">None</option>
			</select>

			<ColorPicker
				value={border.color}
				onchange={(color) => {
					editor?.commands.setCellAttribute('border', {
						...border,
						color
					});
				}}
			/>

			<button onclick={() => editor?.commands.deleteTable()} class="delete-btn"> 🗑 </button>
		</div>
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
