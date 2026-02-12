<script lang="ts">
	import { UpdateBlockCommand } from '$lib/commands/blocks/UpdateBlockCommand';
	import ButtonControls from '$lib/components/sidebarTabs/settingsTab/ButtonControls.svelte';
	import { getHistoryContext } from '$lib/history/contexts/historyContext.svelte';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import type { ButtonBlockEntity } from '$lib/template/types';
	import { debounce } from '$lib/template/utils/debounce';

	interface Props {
		entity: ButtonBlockEntity;
	}
	const { entity }: Props = $props();

	const templateStore = getTemplateContext();
	const historyService = getHistoryContext();

	const handleStyleUpdate = debounce((updates: Record<string, string>) => {
		const coordinates = templateStore.getBlockCoordinates(entity.id);
		if (!coordinates) return;
		const command = new UpdateBlockCommand({
			store: templateStore,
			coordinates,
			updates: {
				style: {
					...entity.style,
					...updates
				}
			}
		});
		historyService.executeCommand(command, {
			type: 'block.update'
		});
	}, 300);

	const handleControlUpdate = (name: string, value: string) => {
		handleStyleUpdate({ [name]: value });
	};
</script>

<div class="container">
	<ButtonControls config={entity.style} onUpdate={handleControlUpdate} />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		overflow: hidden;
		gap: 4px;
	}
</style>
