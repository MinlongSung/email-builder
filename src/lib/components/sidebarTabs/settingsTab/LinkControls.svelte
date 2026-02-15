<script lang="ts">
	import ColorPicker from '$lib/components/ui/colorPicker/ColorPicker.svelte';

	interface LinkConfig {
		color?: string;
		isUnderlined?: boolean;
	}

	interface Props {
		config?: LinkConfig;
		onUpdate: (name: string, value: string | boolean) => void;
	}

	let { config, onUpdate }: Props = $props();
</script>

<p>Color</p>
<ColorPicker
	value={config?.color || '#0000ff'}
	onchange={(color) => onUpdate('color', color)}
/>

<p>Underlined</p>
<label class="checkbox-label">
	<input
		type="checkbox"
		checked={config?.isUnderlined ?? true}
		onchange={(e) => onUpdate('isUnderlined', e.currentTarget.checked)}
	/>
	<span>Show underline</span>
</label>

<style>
	p {
		margin: 8px 0 4px 0;
		font-size: 14px;
		color: #666;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-size: 14px;
		color: #333;
		padding: 8px 0;
	}

	.checkbox-label input[type='checkbox'] {
		cursor: pointer;
		width: 16px;
		height: 16px;
	}
</style>
