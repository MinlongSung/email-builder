<script lang="ts">
	import { getRichtextContext } from '../contexts/richtextContext.svelte';

	interface Props {
		content: string;
	}
	const { content }: Props = $props();
	const richtextContext = getRichtextContext();

	const handlePointerDown = (e: PointerEvent) => {
		richtextContext.selectionCoordinates.start = { x: e.clientX, y: e.clientY };
	};

	const handlePointerUp = (e: PointerEvent) => {
		richtextContext.selectionCoordinates.end = { x: e.clientX, y: e.clientY };
	};
</script>

<div onpointerdown={handlePointerDown} onpointerup={handlePointerUp} class="editorPreview">
	{@html content}
</div>

<style>
	.editorPreview :global(td p:empty::before),
	.editorPreview :global(td h1:empty::before),
	.editorPreview :global(td h2:empty::before),
	.editorPreview :global(td h3:empty::before),
	.editorPreview :global(td h4:empty::before),
	.editorPreview :global(td h5:empty::before),
	.editorPreview :global(td h6:empty::before),
	.editorPreview :global(th p:empty::before),
	.editorPreview :global(th h1:empty::before),
	.editorPreview :global(th h2:empty::before),
	.editorPreview :global(th h3:empty::before),
	.editorPreview :global(th h4:empty::before),
	.editorPreview :global(th h5:empty::before),
	.editorPreview :global(th h6:empty::before) {
		content: '\00a0';
	}
</style>
