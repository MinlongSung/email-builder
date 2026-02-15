<script lang="ts">
	import { isValidHex, shouldUseDarkText } from './colorUtils';

	interface Props {
		value: string;
		onchange: (hex: string) => void;
	}

	const { value, onchange }: Props = $props();

	let inputValue = $state('');

	$effect(() => {
		inputValue = value;
	});

	const textColor = $derived(
		value === 'transparent' ? '#666' : shouldUseDarkText(value) ? '#000' : '#fff'
	);

	function handleInput(e: Event) {
		const newValue = (e.currentTarget as HTMLInputElement).value.replace('#', '');
		inputValue = newValue;

		if (newValue.length === 6) {
			const hex = `#${newValue}`;
			if (isValidHex(hex)) {
				onchange(hex.toLowerCase());
			}
		}
	}
</script>

<div
	class="hex-badge"
	class:transparent={value === 'transparent'}
	style:background-color={value === 'transparent' ? '#f3f3f3' : value}
	style:color={textColor}
>
	<span class="hex-prefix">#</span>

	<input
		type="text"
		class="hex-input"
		maxlength={6}
		value={inputValue.replace('#', '')}
		oninput={handleInput}
		style:color={textColor}
		aria-label="Código de color hexadecimal"
	/>
</div>

<style>
	.hex-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6px 14px;
		border-radius: 16px;
		font-family: monospace;
		font-size: 14px;
		font-weight: 600;
		min-width: 100px;
		transition: all 0.2s ease;
		cursor: text;
	}

	.hex-badge.transparent {
		background:
			linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
			linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
			linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
		background-size: 16px 16px;
		background-position: 0 0, 0 8px, 8px -8px, -8px 0;
		color: #666;
	}

	.hex-prefix {
		line-height: 1;
		margin-right: 1px;
	}

	.hex-input {
		background: transparent;
		border: none;
		outline: none;
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
		color: inherit;
		text-align: center;
		width: 60px;
		padding: 0;
		line-height: 1;
	}

	.hex-input::selection {
		background: rgba(255, 255, 255, 0.3);
	}
</style>
