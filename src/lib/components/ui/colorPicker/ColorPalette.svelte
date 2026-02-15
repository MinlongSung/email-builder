<script lang="ts">
	interface Props {
		value: string;
		onchange: (hex: string) => void;
	}

	const { value, onchange }: Props = $props();

	const PRESET_COLORS = [
		// Fila 1: Transparente + Grises de blanco a negro
		['transparent', '#ffffff', '#d9d9d9', '#b3b3b3', '#808080', '#4d4d4d', '#000000'],
		// Fila 2: Tonos muy claros/pasteles
		['#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#d9d2e9'],
		// Fila 3: Tonos claros
		['#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#b4a7d6'],
		// Fila 4: Tonos medios
		['#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3'],
		// Fila 5: Tonos saturados
		['#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7'],
		// Fila 6: Tonos oscuros
		['#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75']
	];

	const normalizedValue = $derived(value.toLowerCase());
</script>

<div class="palette-grid">
	{#each PRESET_COLORS as row}
		<div class="palette-row">
			{#each row as color}
				<button
					class="palette-swatch"
					class:transparent-swatch={color === 'transparent'}
					class:selected={normalizedValue === color}
					style:background-color={color === 'transparent' ? undefined : color}
					onclick={() => onchange(color)}
					aria-label={color === 'transparent' ? 'Transparent' : `Color ${color}`}
				></button>
			{/each}
		</div>
	{/each}
</div>

<style>
	.palette-grid {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.palette-row {
		display: flex;
		gap: 5px;
	}

	.palette-swatch {
		flex: 1;
		aspect-ratio: 1;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		cursor: pointer;
		padding: 0;
		outline: none;
	}

	.palette-swatch:hover {
		transform: scale(1.08);
		z-index: 1;
	}

	.palette-swatch.selected {
		box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6;
	}

	.transparent-swatch {
		background:
			linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
			linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
			linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
		background-size: 8px 8px;
		background-position: 0 0, 0 4px, 4px -4px, -4px 0;
	}
</style>
