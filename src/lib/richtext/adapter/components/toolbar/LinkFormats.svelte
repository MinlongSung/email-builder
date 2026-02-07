<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
	const editor = $derived(richtextContext.activeEditor);
</script>

<div class="container">
	<button
		onclick={() => {
			const url = window.prompt('Enter URL:');
			if (url) {
				editor?.chain().focus().setLink({ href: url }).run();
			}
		}}
		class:selected={editor?.isActive('link')}
		title="Insert Link"
	>
		LINK
	</button>

	<button
		onclick={() => editor?.chain().focus().unsetLink().run()}
		title="Remove Link"
		disabled={editor?.isActive('link')}
	>
		UNLINK
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
