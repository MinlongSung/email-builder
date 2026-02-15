<script lang="ts">
	import { PRESETS } from '$lib/richtext/adapter/types';
	import ColorPicker from '$lib/components/ui/colorPicker/ColorPicker.svelte';

	interface TypographyConfig {
		fontFamily?: string;
		fontSize?: string;
		lineHeight?: string;
		letterSpacing?: string;
		color?: string;
	}

	interface Props {
		config?: TypographyConfig;
		onUpdate: (name: string, value: string) => void;
	}

	let { config, onUpdate }: Props = $props();
</script>

<p>Font family</p>
<select
	value={config?.fontFamily || ''}
	onchange={(e) => onUpdate('fontFamily', e.currentTarget.value)}
>
	<option value="">Default</option>
	{#each PRESETS.FONT_FAMILY as fontFamily}
		<option value={fontFamily}>{fontFamily}</option>
	{/each}
</select>

<p>Font size</p>
<input
	type="text"
	value={config?.fontSize || ''}
	oninput={(e) => onUpdate('fontSize', e.currentTarget.value)}
	placeholder="e.g., 16px, 1em"
/>

<p>Line height</p>
<input
	type="text"
	value={config?.lineHeight || ''}
	oninput={(e) => onUpdate('lineHeight', e.currentTarget.value)}
	placeholder="e.g., 1.5, 24px"
/>

<p>Letter spacing</p>
<input
	type="text"
	value={config?.letterSpacing || ''}
	oninput={(e) => onUpdate('letterSpacing', e.currentTarget.value)}
	placeholder="e.g., 0.05em, 1px"
/>

<p>Color</p>
<ColorPicker
	value={config?.color || '#000000'}
	onchange={(color) => onUpdate('color', color)}
/>

<style>
	p {
		margin: 8px 0 4px 0;
		font-size: 14px;
		color: #666;
	}

	select,
	input {
		width: 100%;
		padding: 6px 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 14px;
	}

	select:focus,
	input:focus {
		outline: none;
		border-color: #3b82f6;
	}
</style>
