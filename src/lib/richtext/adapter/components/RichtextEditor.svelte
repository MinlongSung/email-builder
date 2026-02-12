<script lang="ts">
	import { Editor } from '$lib/richtext/core/Editor';
	import type { EditorContent, EditorEvents, Extension } from '$lib/richtext/core/types';
	import { onMount } from 'svelte';

	interface Props {
		content: EditorContent;
		extensions: Extension[];
		onCreate?: (props: EditorEvents['create']) => void;
		onUpdate?: (props: EditorEvents['update']) => void;
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
			onCreate,
			onUpdate,
			onDestroy
		});

		return () => {
			editor?.destroy();
			editor = null;
		};
	});
</script>

<div bind:this={element}></div>
