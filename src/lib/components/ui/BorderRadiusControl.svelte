<script lang="ts">
	import { debounce } from '$lib/template/utils/debounce';

	const STEP = 5;
	const MIN = 0;
	const MAX = 100;
	const CORNERS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'] as const;

	interface Props {
		values: [number, number, number, number];
		onchange: (values: [number, number, number, number]) => void;
	}
	const { values, onchange }: Props = $props();

	let isPerCorner = $state(false);

	function clamp(value: number): number {
		return Math.max(MIN, Math.min(Math.round(value), MAX));
	}

	function updateCorner(cornerIndex: number, rawValue: number) {
		const updated = [...values] as [number, number, number, number];
		updated[cornerIndex] = clamp(rawValue);
		onchange(updated);
	}

	function updateAll(rawValue: number) {
		const v = clamp(rawValue);
		onchange([v, v, v, v]);
	}

	const debouncedUpdateCorner = debounce(updateCorner, 300);
	const debouncedUpdateAll = debounce(updateAll, 300);
</script>

<div>
	<label>
		<input type="checkbox" checked={isPerCorner} onchange={() => (isPerCorner = !isPerCorner)} />
		Border radius por esquina
	</label>

	<div style="display: flex; flex-direction: column">
		{#if isPerCorner}
			{#each CORNERS as corner, i}
				<label>
					{corner}:
					<button
						onclick={() => updateCorner(i, values[i] - STEP)}
						disabled={values[i] - STEP < MIN}
					>
						-{STEP}
					</button>
					<input
						type="number"
						min={MIN}
						max={MAX}
						step="1"
						value={values[i]}
						oninput={(e) => debouncedUpdateCorner(i, +e.currentTarget.value)}
					/>
					<button
						onclick={() => updateCorner(i, values[i] + STEP)}
						disabled={values[i] + STEP > MAX}
					>
						+{STEP}
					</button>
				</label>
			{/each}
		{:else}
			<label>
				Border radius (px):
				<button
					onclick={() => updateAll(values[0] - STEP)}
					disabled={values[0] - STEP < MIN}
				>
					-{STEP}
				</button>
				<input
					type="number"
					min={MIN}
					max={MAX}
					step="1"
					value={values[0]}
					oninput={(e) => debouncedUpdateAll(+e.currentTarget.value)}
				/>
				<button
					onclick={() => updateAll(values[0] + STEP)}
					disabled={values[0] + STEP > MAX}
				>
					+{STEP}
				</button>
			</label>
		{/if}
	</div>
</div>
