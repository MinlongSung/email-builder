<script lang="ts">
	import { historyService } from '$lib/commands/history/HistoryService.svelte';
	import { UpdateRootCommand } from '$lib/commands/structures/root/UpdateRootCommand';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import type { RootEntity } from '$lib/template/types';
	import { debounce } from '$lib/template/utils/debounce';

	const templateContext = getTemplateContext();

	const root = $derived(templateContext.template.root);
	let width = $derived(root.width || 600);
	let backgroundColor = $derived(root.style?.["background-color"] || "#ffffff");

	const handleRootUpdate = debounce((updates: Partial<RootEntity>) => {
		const command = new UpdateRootCommand({
			store: templateContext,
			updates
		});
		historyService.executeCommand(command, {
			type: 'root.update.width'
		});
	}, 300);

	const handleWidthUpdate = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		handleRootUpdate({ width: +e.currentTarget.value });
	};

	const handleBackgroundColorUpdate = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		handleRootUpdate({
			style: {
				...root.style,
				'background-color': e.currentTarget.value
			}
		});
	};
</script>

<div class="panel">
	<h3>Settings</h3>
	<p>Template settings</p>

	<p>Width</p>
	<input type="number" bind:value={width} oninput={handleWidthUpdate} />

	<p>Background Color</p>
	<input type="color" bind:value={backgroundColor} oninput={handleBackgroundColorUpdate} />
</div>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.panel h3 {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		color: #333;
	}

	.panel p {
		margin: 0;
		font-size: 14px;
		color: #666;
	}
</style>
