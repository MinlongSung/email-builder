<script lang="ts">
	import { debounce } from '$lib/template/utils/debounce';

	const STEP = 5;
	const MIN = 0;
	const MAX = 100;
	const SIDES = ['top', 'right', 'bottom', 'left'] as const;

	interface Props {
		values: [number, number, number, number];
		onchange: (padding: [number, number, number, number]) => void;
	}
	const { values, onchange }: Props = $props();

	let isPerSide = $state(false);

	function clamp(value: number): number {
		return Math.max(MIN, Math.min(Math.round(value), MAX));
	}

	function updateSide(sideIndex: number, rawValue: number) {
		const updated = [...values] as [number, number, number, number];
		updated[sideIndex] = clamp(rawValue);
		onchange(updated);
	}

	function updateAll(rawValue: number) {
		const v = clamp(rawValue);
		onchange([v, v, v, v]);
	}

	const debouncedUpdateSide = debounce(updateSide, 300);
	const debouncedUpdateAll = debounce(updateAll, 300);
</script>

<div>
	<label>
		<input type="checkbox" checked={isPerSide} onchange={() => (isPerSide = !isPerSide)} />
		Padding por lado
	</label>

	<div style="display: flex; flex-direction: column">
		{#if isPerSide}
			{#each SIDES as side, i}
				<label>
					{side}:
					<button
						onclick={() => updateSide(i, values[i] - STEP)}
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
						oninput={(e) => debouncedUpdateSide(i, +e.currentTarget.value)}
					/>
					<button
						onclick={() => updateSide(i, values[i] + STEP)}
						disabled={values[i] + STEP > MAX}
					>
						+{STEP}
					</button>
				</label>
			{/each}
		{:else}
			<label>
				Padding (px):
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
