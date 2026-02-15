<script lang="ts">
	import { clamp } from './colorUtils';

	interface Props {
		hue: number;
		onchange: (h: number) => void;
	}

	const { hue, onchange }: Props = $props();

	let trackEl: HTMLDivElement | undefined = $state();

	function updateFromPointer(e: PointerEvent) {
		if (!trackEl) return;
		const rect = trackEl.getBoundingClientRect();
		const ratio = clamp((e.clientY - rect.top) / rect.height, 0, 1);
		onchange(ratio * 360);
	}

	function handlePointerDown(e: PointerEvent) {
		if (!trackEl) return;
		trackEl.setPointerCapture(e.pointerId);
		updateFromPointer(e);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!trackEl) return;
		if (!trackEl.hasPointerCapture(e.pointerId)) return;
		updateFromPointer(e);
	}

	function handlePointerUp(e: PointerEvent) {
		if (!trackEl) return;
		trackEl.releasePointerCapture(e.pointerId);
	}
</script>

<div
	class="hue-track"
	bind:this={trackEl}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	role="slider"
	tabindex="0"
	aria-label="Hue"
	aria-valuemin={0}
	aria-valuemax={360}
	aria-valuenow={Math.round(hue)}
>
	<div class="hue-thumb" style:top="{(hue / 360) * 100}%"></div>
</div>

<style>
	.hue-track {
		position: relative;
		width: 20px;
		height: 100%;
		border-radius: 0;
		cursor: ns-resize;
		touch-action: none;
		user-select: none;	
		background: linear-gradient(
			to bottom,
			hsl(0, 100%, 50%),
			hsl(60, 100%, 50%),
			hsl(120, 100%, 50%),
			hsl(180, 100%, 50%),
			hsl(240, 100%, 50%),
			hsl(300, 100%, 50%),
			hsl(360, 100%, 50%)
		);
	}

	.hue-thumb {
		position: absolute;
		left: 50%;
		width: 20px;
		height: 4px;
		background: transparent;
		border: 2px solid #fff;
		border-radius: 2px;
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
		transform: translate(-50%, -50%);
		pointer-events: none;
	}
</style>
