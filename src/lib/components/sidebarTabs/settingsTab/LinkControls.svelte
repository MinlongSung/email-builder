<script lang="ts">
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
<input
	type="color"
	value={config?.color || '#0000ff'}
	oninput={(e) => onUpdate('color', e.currentTarget.value)}
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

	input[type='color'] {
		width: 100%;
		height: 40px;
		padding: 4px;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: pointer;
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
