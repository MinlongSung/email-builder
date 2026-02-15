<script lang="ts">
	import { hsvToRgb, rgbToHex, clamp } from './colorUtils';

	interface Props {
		hue: number;
		saturation: number;
		brightness: number;
		onchange: (s: number, v: number) => void;
	}

	const { hue, saturation, brightness, onchange }: Props = $props();

	let canvasEl: HTMLDivElement | undefined = $state();

	const hueColor = $derived(rgbToHex(hsvToRgb({ h: hue, s: 1, v: 1 })));

	function updateFromPointer(e: PointerEvent) {
		if (!canvasEl) return;
		const rect = canvasEl.getBoundingClientRect();
		const s = clamp((e.clientX - rect.left) / rect.width, 0, 1);
		const v = clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1);
		onchange(s, v);
	}

	function handlePointerDown(e: PointerEvent) {
		if (!canvasEl) return;
		canvasEl.setPointerCapture(e.pointerId);
		updateFromPointer(e);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!canvasEl) return;
		if (!canvasEl.hasPointerCapture(e.pointerId)) return;
		updateFromPointer(e);
	}

	function handlePointerUp(e: PointerEvent) {
		if (!canvasEl) return;
		canvasEl.releasePointerCapture(e.pointerId);
	}
</script>

<div
	class="sv-canvas"
	bind:this={canvasEl}
	style:--hue-color={hueColor}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	role="slider"
	tabindex="0"
	aria-label="Saturation and brightness"
	aria-valuenow={Math.round(saturation * 100)}
	aria-valuetext="Saturation {Math.round(saturation * 100)}%, Brightness {Math.round(brightness * 100)}%"
>
	<div
		class="sv-cursor"
		style:left="{saturation * 100}%"
		style:top="{(1 - brightness) * 100}%"
	></div>
</div>

<style>
	.sv-canvas {
		position: relative;
		flex: 1;
		height: 100%;
		border-radius: 0;
		cursor: crosshair;
		touch-action: none;
		user-select: none;
		background:
			linear-gradient(to bottom, transparent, #000),
			linear-gradient(to right, #fff, var(--hue-color));
		overflow: hidden;
	}

	.sv-cursor {
		position: absolute;
		width: 20px;
		height: 20px;
		border: 3px solid #fff;
		border-radius: 50%;
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
		transform: translate(-50%, -50%);
		pointer-events: none;
	}
</style>
