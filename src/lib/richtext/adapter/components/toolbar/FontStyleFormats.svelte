<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';
	import { PRESETS } from '../../types';
	import ColorPicker from '$lib/components/ui/colorPicker/ColorPicker.svelte';

	const LETTER_SPACING_PRESETS = [
		{ label: 'Normal', value: 'normal' },
		{ label: 'Tight (-0.05em)', value: '-0.05em' },
		{ label: 'Wide (0.05em)', value: '0.05em' },
		{ label: 'Wider (0.1em)', value: '0.1em' },
		{ label: 'Widest (0.2em)', value: '0.2em' }
	];

	const richtextContext = getRichtextContext();
	const editor = $derived(richtextContext.activeEditor);
</script>

<div class="container">
	<select
		onchange={(e) => {
			const value = e.currentTarget.value;
			if (value) {
				editor?.chain().focus().setFontSize(value).run();
			} else {
				editor?.chain().focus().unsetFontSize().run();
			}
		}}
		title="Font Size"
	>
		<option value="">Size</option>
		<option value="12px">12px</option>
		<option value="14px">14px</option>
		<option value="16px">16px</option>
		<option value="18px">18px</option>
		<option value="20px">20px</option>
		<option value="24px">24px</option>
		<option value="28px">28px</option>
		<option value="32px">32px</option>
		<option value="36px">36px</option>
	</select>

	<select
		onchange={(e) => {
			const value = e.currentTarget.value;
			if (value) {
				editor?.chain().focus().setFontFamily(value).run();
			} else {
				editor?.chain().focus().unsetFontFamily().run();
			}
		}}
		title="Font Family"
	>
		<option value="">Font</option>
		{#each PRESETS.FONT_FAMILY as fontFamily}
			<option value={fontFamily}>
				{fontFamily}
			</option>
		{/each}
	</select>

	<select
		onchange={(e) => {
			const value = e.currentTarget.value;
			if (value) {
				editor?.chain().focus().setLetterSpacing(value).run();
			} else {
				editor?.chain().focus().unsetLetterSpacing().run();
			}
		}}
		title="Letter spacing"
	>
		<option value="">Letter spacing</option>
		{#each LETTER_SPACING_PRESETS as spacing}
			<option value={spacing.value}>
				{spacing.label}
			</option>
		{/each}
	</select>

	<ColorPicker
		value={editor?.getAttributes('textStyle')?.color || '#000000'}
		onchange={(color) => editor?.chain().focus().setColor(color).run()}
	/>
	<button
		type="button"
		onclick={() => editor?.chain().focus().unsetColor().run()}
		title="Clear Text Color"
	>
		clear color
	</button>

	<ColorPicker
		value={editor?.getAttributes('textStyle')?.backgroundColor || '#ffffff'}
		onchange={(color) => editor?.chain().focus().setBackgroundColor(color).run()}
	/>
	<button
		type="button"
		onclick={() => editor?.chain().focus().unsetBackgroundColor().run()}
		title="Clear Background Color"
	>
		clear bg
	</button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 4px;
	}
</style>
