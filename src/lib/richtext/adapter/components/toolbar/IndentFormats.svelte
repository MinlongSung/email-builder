<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
  const editor = $derived(richtextContext.activeEditor);
</script>

<div class="container">
	<button onclick={() => editor?.chain().focus().setIndentation(30).run()}>
		INDENT
	</button>
	<button
		onclick={() => editor?.chain().focus().setIndentation(-15).run()}
		disabled={!editor?.can().setIndentation?.(-15)}
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
