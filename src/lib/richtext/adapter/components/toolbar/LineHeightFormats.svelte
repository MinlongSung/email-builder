<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const LINE_HEIGHT_PRESETS = [
		{ value: '1', label: '1.0 (Compacto)' },
		{ value: '1.15', label: '1.15 (Ajustado)' },
		{ value: '1.2', label: '1.2 (Normal)' },
		{ value: '1.4', label: '1.4 (Cómodo)' },
		{ value: '1.5', label: '1.5 (Lectura)' },
		{ value: '1.75', label: '1.75 (Amplio)' },
		{ value: '2', label: '2.0 (Muy amplio)' }
	];

	const richtextContext = getRichtextContext();
</script>

<div class="container">
	<select
		onchange={(e) => {
			const value = e.currentTarget.value;
			if (value) {
				richtextContext.activeEditor.editor?.chain().focus().setLineHeight(value).run();
			} else {
				richtextContext.activeEditor.editor?.chain().focus().unsetLineHeight().run();
			}
		}}
		title="Line Height"
	>
		{#each LINE_HEIGHT_PRESETS as lineHeight}
			<option value={lineHeight.value || ''}>
				{lineHeight.label}
			</option>
		{/each}
	</select>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 4px;
	}
</style>
