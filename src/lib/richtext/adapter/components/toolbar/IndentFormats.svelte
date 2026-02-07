<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
</script>

<div class="container">
	<button
		onclick={() => richtextContext.activeEditor.editor?.chain().focus().setIndentation(30).run()}
	>
		INDENT
	</button>
	<button
		onclick={() => richtextContext.activeEditor.editor?.chain().focus().setIndentation(-15).run()}
		disabled={!richtextContext.activeEditor.editor?.can().setIndentation?.(-15)}
	>
		OUTDENT
	</button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 4px;
	}
</style>
