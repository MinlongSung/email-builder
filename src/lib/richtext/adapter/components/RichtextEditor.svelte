<script lang="ts">
	import { Editor } from '$lib/richtext/core/Editor';
	import type { EditorContent, Extension } from '$lib/richtext/core/types';
	import { onMount } from 'svelte';
	import type { Transaction } from 'prosemirror-state';

	interface Props {
		content: EditorContent;
		extensions: Extension[];
		onCreate?: (editor: Editor) => void;
		onUpdate?: (editor: Editor, transaction: Transaction) => void;
		onDestroy?: () => void;
	}
	const { content, extensions, onCreate, onUpdate, onDestroy }: Props = $props();

	let element: HTMLElement;
	let editor: Editor | null = null;
	onMount(() => {
		editor = new Editor({
			element,
			extensions,
			content,
			onCreate: ({ editor }) => onCreate?.(editor),
			onUpdate: ({ editor, transaction }) => onUpdate?.(editor, transaction),
			onDestroy: () => onDestroy?.()
		});

		return () => {
			editor?.destroy();
			editor = null;
		};
	});
</script>

<div bind:this={element}></div>
