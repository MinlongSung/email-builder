<script lang="ts">
	import { Editor } from '$lib/richtext/core/Editor';
	import type { EditorContent, Extension } from '$lib/richtext/core/types';
	import { onMount, tick } from 'svelte';
	import { getRichtextContext } from '../contexts/richtextContext.svelte';
	import { historyService } from '$lib/commands/history/HistoryService.svelte';

	interface Props {
		content: EditorContent;
		extensions: Extension[];
		onUpdate: (editor: Editor) => void;
	}
	const { content, extensions, onUpdate }: Props = $props();
	const richtextContext = getRichtextContext();

	let element: HTMLElement;
	let editor = $state<Editor | null>(null);
	onMount(() => {
		editor = new Editor({
			element,
			extensions,
			content,
			onCreate: ({ editor }) => {
				richtextContext.activeEditor = { editor };
				const { start, end } = richtextContext.selectionCoordinates;
				const from = editor.view.posAtCoords({ left: start.x, top: start.y })?.pos;
				const to = editor.view.posAtCoords({ left: end.x, top: end.y })?.pos;
				if (from && to) editor.commands.setTextSelection({ from, to });
				editor.commands.focus();
			},
			onUpdate: ({ editor }) => onUpdate(editor),
			onTransaction: ({ editor }) => {
				richtextContext.activeEditor = { editor }
			}
		});

		const syncContent = async () => {
			await tick();
			editor?.commands.setContent(content, { emitUpdate: false });
		};

		historyService.on('undo', syncContent);
		historyService.on('redo', syncContent);
		historyService.on('goto', syncContent);
		return () => {
			historyService.off('undo', syncContent);
			historyService.off('redo', syncContent);
			historyService.off('goto', syncContent);
			editor?.destroy();
			editor = null;
			richtextContext.activeEditor = { editor: null };
		};
	});
</script>

<div bind:this={element}></div>
