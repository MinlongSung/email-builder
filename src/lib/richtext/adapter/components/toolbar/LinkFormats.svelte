<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
</script>

<div class="container">
	<button
		onclick={() => {
			const url = window.prompt('Enter URL:');
			if (url) {
				richtextContext.activeEditor.editor?.chain().focus().setLink({ href: url }).run();
			}
		}}
		class:selected={richtextContext.activeEditor.editor?.isActive('link')}
		title="Insert Link"
	>
		LINK
	</button>

	<button
		onclick={() => richtextContext.activeEditor.editor?.chain().focus().unsetLink().run()}
		title="Remove Link"
		disabled={richtextContext.activeEditor.editor?.isActive('link')}
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
