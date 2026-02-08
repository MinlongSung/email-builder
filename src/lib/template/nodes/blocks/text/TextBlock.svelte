<script lang="ts">
	import { UpdateBlockCommand } from '$lib/commands/blocks/UpdateBlockCommand';
	import { historyService } from '$lib/history/HistoryService.svelte';
	import ProsemirrorEditor from '$lib/richtext/adapter/components/RichtextEditor.svelte';
	import ProsemirrorPreview from '$lib/richtext/adapter/components/RichtextPreview.svelte';
	import TableMenu from '$lib/richtext/adapter/components/toolbar/TableMenu.svelte';
	import { buildTextExtensions } from '$lib/richtext/adapter/utils/buildExtensions';
	import { createRichtextBlockHandlers } from '$lib/richtext/adapter/utils/createRichtextBlockHandlers.svelte';
	import type { Editor } from '$lib/richtext/core/Editor';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { getUIContext } from '$lib/template/contexts/uiContext.svelte';
	import { type TextBlockEntity } from '$lib/template/types';
	import { debounce } from '$lib/template/utils/debounce';

	interface Props {
		entity: TextBlockEntity;
	}
	const { entity, ...props }: Props = $props();
	const uiContext = getUIContext();
	const templateContext = getTemplateContext();
	const templateConfig = $derived(templateContext.template.config);
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

<div {...props}>
	{#if uiContext.selectedId === entity.id}
		<ProsemirrorEditor
			content={entity.content.json}
			extensions={buildTextExtensions(templateConfig)}
			onCreate={handleCreate}
			onUpdate={handleUpdate}
			onDestroy={handleDestroy}
		/>
		<TableMenu />
	{:else}
		<ProsemirrorPreview content={entity.content.html} />
	{/if}
</div>
