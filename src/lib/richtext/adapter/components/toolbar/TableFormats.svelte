<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';
	import { tableCoordinatesPluginKey } from '$lib/richtext/core/extensions/nodes/table/plugins/tableCoordinates';
	import { cellSelectionPluginKey } from '$lib/richtext/core/extensions/nodes/table/plugins/cellSelection';

	const richtextContext = getRichtextContext();

	const tableState = $derived.by(() => {
		const editor = richtextContext.activeEditor.editor;
		if (!editor) return null;
		const tableCoordinatesState = tableCoordinatesPluginKey.getState(editor.state);
		const cellSelectionState = cellSelectionPluginKey.getState(editor.state);
		return {
			rect: tableCoordinatesState?.rect ?? null,
			cellAttrs: cellSelectionState?.cellAttrs ?? null,
			canMergeCells: editor.can()?.mergeCells?.() ?? false,
			canSplitCell: editor.can()?.splitCell?.() ?? false
		};
	});

	let backgroundColor = $derived(tableState?.cellAttrs?.backgroundColor || '#ffffff');

	let border = $derived(
		tableState?.cellAttrs?.border || { width: '1px', style: 'solid', color: '#000000' }
	);

	let borderWidth = $derived(parseInt(border.width) || 1);

	let centerX = $derived(tableState?.rect ? tableState.rect.left + tableState.rect.width / 2 : 0);

	function handleBackgroundColorChange(e: Event & { currentTarget: HTMLInputElement }) {
		richtextContext.activeEditor.editor?.commands.setCellAttribute(
			'backgroundColor',
			e.currentTarget.value
		);
	}

	function handleBorderWidthChange(e: Event & { currentTarget: HTMLInputElement }) {
		const value = e.currentTarget.value || '1';
		richtextContext.activeEditor.editor?.commands.setCellAttribute('border', {
			...border,
			width: value.includes('px') ? value : `${value}px`
		});
	}

	function handleBorderStyleChange(e: Event & { currentTarget: HTMLSelectElement }) {
		richtextContext.activeEditor.editor?.commands.setCellAttribute('border', {
			...border,
			style: e.currentTarget.value
		});
	}

	function handleBorderColorChange(e: Event & { currentTarget: HTMLInputElement }) {
		richtextContext.activeEditor.editor?.commands.setCellAttribute('border', {
			...border,
			color: e.currentTarget.value
		});
	}

	function incrementBorderWidth() {
		richtextContext.activeEditor.editor?.commands.setCellAttribute('border', {
			...border,
			width: `${borderWidth + 1}px`
		});
	}

	function decrementBorderWidth() {
		if (borderWidth > 1) {
			richtextContext.activeEditor.editor?.commands.setCellAttribute('border', {
				...border,
				width: `${borderWidth - 1}px`
			});
		}
	}
</script>

<div class="container">
	<button
		onclick={() =>
			richtextContext.activeEditor.editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
		title="Insert Table"
	>
		TABLE
	</button>
</div>

<!-- TODO: MENU EN SCROLL NO SE QUEDA EN EL SITIO,
     SI PONGO MENU EN ZONA IZQ, SE CORTA.... mantener dentro del viewport -->
{#if tableState?.rect}
	<div
		class="table-menu"
		data-no-dismiss
		style:top="{tableState.rect.top - 10}px"
		style:left="{centerX}px"
	>
		<button onclick={() => richtextContext.activeEditor.editor?.commands.addRowBefore()}
			>+ Row ↑</button
		>
		<button onclick={() => richtextContext.activeEditor.editor?.commands.addRowAfter()}
			>+ Row ↓</button
		>
		<button onclick={() => richtextContext.activeEditor.editor?.commands.addColumnBefore()}
			>+ Col ←</button
		>
		<button onclick={() => richtextContext.activeEditor.editor?.commands.addColumnAfter()}
			>+ Col →</button
		>

		<button onclick={() => richtextContext.activeEditor.editor?.commands.deleteRow()}>- Row</button>
		<button onclick={() => richtextContext.activeEditor.editor?.commands.deleteColumn()}
			>- Col</button
		>

		{#if tableState.cellAttrs}
			<button
				onclick={() => richtextContext.activeEditor.editor?.commands.mergeCells()}
				disabled={!tableState.canMergeCells}
			>
				⬌ Merge
			</button>
			<button
				onclick={() => richtextContext.activeEditor.editor?.commands.splitCell()}
				disabled={!tableState.canSplitCell}
			>
				⬍ Split
			</button>

			<input
				type="color"
				value={backgroundColor}
				oninput={handleBackgroundColorChange}
				title="Background color"
			/>

			<button onclick={decrementBorderWidth}>-</button>
			<input
				type="number"
				value={borderWidth}
				onchange={handleBorderWidthChange}
				class="border-width-input"
				min="0"
			/>
			<button onclick={incrementBorderWidth}>+</button>

			<select value={border.style} onchange={handleBorderStyleChange}>
				<option value="solid">—</option>
				<option value="dashed">- -</option>
				<option value="dotted">···</option>
				<option value="double">═</option>
				<option value="none">None</option>
			</select>

			<input
				type="color"
				value={border.color}
				oninput={handleBorderColorChange}
				title="Border color"
			/>
		{/if}

		<button
			onclick={() => richtextContext.activeEditor.editor?.commands.deleteTable()}
			class="delete-btn"
		>
			🗑
		</button>
	</div>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: row;
		gap: 4px;
	}

	.table-menu {
		position: fixed;
		transform: translate(-50%, -100%);
		border: 1px solid #ccc;
		background-color: white;
		padding: 8px;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		display: flex;
		gap: 8px;
		align-items: center;
		z-index: 1000;
		font-size: 12px;
		flex-wrap: wrap;
	}

	.border-width-input {
		width: 50px;
	}

	.delete-btn {
		color: red;
	}
</style>
