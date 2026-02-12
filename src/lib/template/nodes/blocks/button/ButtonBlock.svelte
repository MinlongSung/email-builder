<script lang="ts">
	import { UpdateBlockCommand } from '$lib/commands/blocks/UpdateBlockCommand';
	import { getHistoryContext } from '$lib/history/contexts/historyContext.svelte';
	import ProsemirrorEditor from '$lib/richtext/adapter/components/RichtextEditor.svelte';
	import ProsemirrorPreview from '$lib/richtext/adapter/components/RichtextPreview.svelte';
	import { buildButtonExtensions } from '$lib/richtext/adapter/utils/buildExtensions';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { getUIContext } from '$lib/template/contexts/uiContext.svelte';
	import { type ButtonBlockEntity } from '$lib/template/types';
	import { stringifyCssObject } from '$lib/template/utils/stringifyCssObject';
	import { debounce } from '$lib/template/utils/debounce';
	import { createRichtextHandlers } from '$lib/richtext/adapter/utils/createRichtextHandlers.svelte';

	interface Props {
		entity: ButtonBlockEntity;
	}
	const { entity, ...props }: Props = $props();
	const uiStore = getUIContext();
	const templateStore = getTemplateContext();
	const historyService = getHistoryContext();

	const style = $derived(stringifyCssObject(entity.style));

	const { handleCreate, handleUpdate, handleDestroy } = createRichtextHandlers({
		historyService,
		getContent: () => entity.content.json,
		onUpdate: debounce(({ editor }) => {
			const coordinates = templateStore.getBlockCoordinates(entity.id);
			if (!coordinates) return;
			const command = new UpdateBlockCommand({
				store: templateStore,
				coordinates,
				updates: {
					content: {
						html: editor.getHTML(),
						json: editor.getJSON()
					}
				}
			});
			historyService.executeCommand(command, {
				type: 'block.update'
			});
		}, 300)
	});
</script>

<a href="https://example.com" {style} onclick={(e) => e.preventDefault()} {...props}>
	{#if uiStore.selectedId === entity.id}
		<ProsemirrorEditor
			content={entity.content.json}
			extensions={buildButtonExtensions()}
			onCreate={handleCreate}
			onUpdate={handleUpdate}
			onDestroy={handleDestroy}
		/>
	{:else}
		<ProsemirrorPreview content={entity.content.html} />
	{/if}
</a>
