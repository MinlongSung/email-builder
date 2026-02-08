<script lang="ts">
	import { UpdateBlockCommand } from '$lib/commands/blocks/UpdateBlockCommand';
	import { historyService } from '$lib/commands/history/HistoryService.svelte';
	import ProsemirrorEditor from '$lib/richtext/adapter/components/RichtextEditor.svelte';
	import ProsemirrorPreview from '$lib/richtext/adapter/components/RichtextPreview.svelte';
	import { buildButtonExtensions } from '$lib/richtext/adapter/utils/buildExtensions';
	import type { Editor } from '$lib/richtext/core/Editor';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { getUIContext } from '$lib/template/contexts/uiContext.svelte';
	import { type ButtonBlockEntity } from '$lib/template/types';
	import { stringifyCssObject } from '$lib/template/utils/stringifyCssObject';
	import { debounce } from '$lib/template/utils/debounce';
	import { createRichtextBlockHandlers } from '$lib/richtext/adapter/utils/createRichtextBlockHandlers.svelte';

	interface Props {
		entity: ButtonBlockEntity;
	}
	const { entity, ...props }: Props = $props();
	const uiContext = getUIContext();
	const templateContext = getTemplateContext();

	const style = $derived(stringifyCssObject(entity.style));

	const { handleCreate, handleUpdate, handleDestroy } = createRichtextBlockHandlers({
		getContent: () => entity.content.json,
		onUpdate: debounce((editor: Editor) => {
			const coordinates = templateContext.getBlockCoordinates(entity.id);
			if (!coordinates) return;
			const command = new UpdateBlockCommand({
				store: templateContext,
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
	{#if uiContext.selectedId === entity.id}
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
