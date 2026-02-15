<script lang="ts">
	/**
	 * ColorPicker - Componente para seleccionar colores
	 *
	 * Características:
	 * - Gradient picker 2D para saturación y brillo
	 * - Slider de matiz (hue)
	 * - Input hex editable con contraste automático (badge)
	 * - Paleta de colores predeterminados
	 * - Paleta de colores personalizados
	 *
	 * Runes de Svelte 5 utilizados:
	 * - $state: estado reactivo local
	 * - $derived: valores calculados automáticamente
	 * - $effect: efectos secundarios que se ejecutan cuando cambian dependencias
	 * - $props: props del componente
	 *
	 * Documentación Svelte 5: https://svelte.dev/docs/svelte/overview
	 */
	import { offset, flip, shift, autoPlacement } from '@floating-ui/dom';
	import { floating } from '$lib/floating-ui/adapter/attachments/floating.svelte';
	import { clickoutside } from '$lib/clickOutside/attachments/clickOutside.svelte';
	import { ClickOutsideStore } from '$lib/clickOutside/contexts/clickOutsideContext.svelte';
	import { hexToHsv, hsvToHex, type HSV } from './colorUtils';
	import SaturationValueCanvas from './SaturationValueCanvas.svelte';
	import HueSlider from './HueSlider.svelte';
	import HexInput from './HexInput.svelte';
	import ColorPalette from './ColorPalette.svelte';
	import { ignoreclickoutside } from '$lib/clickOutside/attachments/ignoreClickOutside.svelte';

	interface Props {
		value: string;
		onchange: (value: string) => void;
	}

	const { value, onchange }: Props = $props();

	let isOpen = $state(false);
	let triggerEl: HTMLDivElement | undefined = $state();
	let popoverEl: HTMLDivElement | undefined = $state();

	const clickOutsideStore = new ClickOutsideStore();

	let hsv: HSV = $state({ h: 0, s: 0, v: 0 });
	let isTransparent = $state(false);

	const displayHex = $derived(isTransparent ? 'transparent' : hsvToHex(hsv));

	$effect(() => {
		if (!isOpen) {
			isTransparent = value === 'transparent';
			const parsed = hexToHsv(value);
			if (parsed) {
				hsv = parsed;
			}
		}
	});

	let rafId = 0;
	function scheduleEmit() {
		cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(() => {
			onchange(hsvToHex(hsv));
		});
	}

	function handleSvChange(s: number, v: number) {
		hsv.s = s;
		hsv.v = v;
		isTransparent = false;
		scheduleEmit();
	}

	function handleHueChange(h: number) {
		hsv.h = h;
		isTransparent = false;
		scheduleEmit();
	}

	function handleHexInput(hex: string) {
		const parsed = hexToHsv(hex);
		if (parsed) {
			hsv = parsed;
			isTransparent = false;
			onchange(hex);
		}
	}

	function handlePaletteSelect(hex: string) {
		if (hex === 'transparent') {
			isTransparent = true;
			onchange('transparent');
			return;
		}
		const parsed = hexToHsv(hex);
		if (parsed) {
			hsv = parsed;
			isTransparent = false;
			onchange(hex);
		}
	}

	function handleTriggerClick() {
		if (!isOpen) {
			isOpen = true;
		}
	}

	function handleClickOutside() {
		isOpen = false;
	}
</script>

<div class="color-picker">
	<div
		bind:this={triggerEl}
		class="trigger"
		role="button"
		tabindex="0"
		onclick={handleTriggerClick}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				handleTriggerClick();
			}
		}}
		aria-label="Color picker"
		aria-expanded={isOpen}
		{@attach ignoreclickoutside({ store: clickOutsideStore })}
	>
		<HexInput value={displayHex} onchange={handleHexInput} />
	</div>

	{#if triggerEl && isOpen}
		<div
			class="popover"
			bind:this={popoverEl}
			{@attach floating({
				referenceElement: triggerEl,
				isVisible: isOpen,
				options: {
					strategy: 'fixed',
					placement: 'bottom-start',
					middleware: [
						offset(8),
						autoPlacement()
					]
				}
			})}
			{@attach clickoutside({
				store: clickOutsideStore,
				onClick: handleClickOutside
			})}
			{@attach ignoreclickoutside({ store: clickOutsideStore })}
		>
			<div class="picker-area">
				<SaturationValueCanvas
					hue={hsv.h}
					saturation={hsv.s}
					brightness={hsv.v}
					onchange={handleSvChange}
				/>
				<HueSlider hue={hsv.h} onchange={handleHueChange} />
			</div>

			<div class="palettes-area">
				<ColorPalette value={displayHex} onchange={handlePaletteSelect} />
			</div>
		</div>
	{/if}
</div>

<style>
	.color-picker {
		display: inline-flex;
		position: relative;
	}

	.trigger {
		cursor: pointer;
		outline: none;
	}

	.trigger:focus-visible {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
		border-radius: 18px;
	}

	.popover {
		z-index: 1000;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
		width: 240px;
		overflow: hidden;
	}

	.picker-area {
		display: flex;
		gap: 0;
		height: 180px;
	}

	.palettes-area {
		padding: 12px;
	}
</style>
