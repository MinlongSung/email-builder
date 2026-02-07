<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
  const editor = $derived(richtextContext.activeEditor);
</script>

<div class="container">
	<button
		onclick={() => editor?.chain().focus().toggleSuperscript().run()}
		class:selected={editor?.isActive('subscript')}
		title="Superscript"
	>
		Super
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleSubscript().run()}
		class:selected={editor?.isActive('superscript')}
		title="Subscript"
	>
		Sub
	</button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 4px;
	}

	.selected {
		background-color: red;
	}
</style>
