<script lang="ts">
	import { PRESETS } from '$lib/richtext/adapter/types';
	import ColorPicker from '$lib/components/ui/colorPicker/ColorPicker.svelte';

	interface ButtonConfig {
		fontFamily?: string;
		fontSize?: string;
		fontWeight?: string;
		fontStyle?: string;
		lineHeight?: string;
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

	// Estados derivados para bold/italic
	const isBold = $derived(config?.fontWeight === 'bold');
	const isItalic = $derived(config?.fontStyle === 'italic');

	// Toggle handlers
	const toggleBold = () => {
		onUpdate('fontWeight', isBold ? 'normal' : 'bold');
	};

	const toggleItalic = () => {
		onUpdate('fontStyle', isItalic ? 'normal' : 'italic');
	};
</script>

<button onclick={toggleBold} class:selected={isBold}> B </button>
<button onclick={toggleItalic} class:selected={isItalic}> I </button>

<p>Font family</p>
<select
	value={config?.fontFamily || ''}
	onchange={(e) => onUpdate('fontFamily', e.currentTarget.value)}
>
	<option value="">Default</option>
	{#each PRESETS.FONT_FAMILY as fontFamily (fontFamily)}
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

<p>Color</p>
<ColorPicker
	value={config?.color || '#ffffff'}
	onchange={(color) => onUpdate('color', color)}
/>

<p>Background color</p>
<ColorPicker
	value={config?.backgroundColor || '#0066cc'}
	onchange={(color) => onUpdate('backgroundColor', color)}
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

	select:focus,
	input:focus {
		outline: none;
		border-color: #3b82f6;
	}

	button {
		padding: 8px 16px;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		font-weight: bold;
		font-size: 14px;
		transition: all 0.2s;
	}

	button:hover {
		background: #f5f5f5;
	}

	button.selected {
		background: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}
</style>
