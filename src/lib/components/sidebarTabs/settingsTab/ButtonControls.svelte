<script lang="ts">
	import { PRESETS } from '$lib/richtext/adapter/types';

	interface ButtonConfig {
		fontFamily?: string;
		fontSize?: string;
		fontWeight?: string;
		lineHeight?: string;
		textDecoration?: string;
		color?: string;
		backgroundColor?: string;
		padding?: string;
		border?: string;
		borderRadius?: string;
	}

	interface Props {
		config?: ButtonConfig;
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

<p>Font weight</p>
<input
	type="text"
	value={config?.fontWeight || ''}
	oninput={(e) => onUpdate('fontWeight', e.currentTarget.value)}
	placeholder="e.g., 400, 700, bold"
/>

<p>Line height</p>
<input
	type="text"
	value={config?.lineHeight || ''}
	oninput={(e) => onUpdate('lineHeight', e.currentTarget.value)}
	placeholder="e.g., 1.5, 24px"
/>

<p>Text decoration</p>
<select
	value={config?.textDecoration || 'none'}
	onchange={(e) => onUpdate('textDecoration', e.currentTarget.value)}
>
	<option value="none">None</option>
	<option value="underline">Underline</option>
	<option value="line-through">Line-through</option>
</select>

<p>Color</p>
<input
	type="color"
	value={config?.color || '#ffffff'}
	oninput={(e) => onUpdate('color', e.currentTarget.value)}
/>

<p>Background color</p>
<input
	type="color"
	value={config?.backgroundColor || '#0066cc'}
	oninput={(e) => onUpdate('backgroundColor', e.currentTarget.value)}
/>

<p>Padding</p>
<input
	type="text"
	value={config?.padding || ''}
	oninput={(e) => onUpdate('padding', e.currentTarget.value)}
	placeholder="e.g., 12px 24px, 1em"
/>

<p>Border</p>
<input
	type="text"
	value={config?.border || ''}
	oninput={(e) => onUpdate('border', e.currentTarget.value)}
	placeholder="e.g., 1px solid #000"
/>

<p>Border radius</p>
<input
	type="text"
	value={config?.borderRadius || ''}
	oninput={(e) => onUpdate('borderRadius', e.currentTarget.value)}
	placeholder="e.g., 4px, 50%"
/>

<style>
	p {
		margin: 8px 0 4px 0;
		font-size: 14px;
		color: #666;
	}

	select,
	input[type='text'] {
		width: 100%;
		padding: 6px 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 14px;
	}

	input[type='color'] {
		width: 100%;
		height: 40px;
		padding: 4px;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: pointer;
	}

	select:focus,
	input:focus {
		outline: none;
		border-color: #3b82f6;
	}
</style>
