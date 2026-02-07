<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
</script>

<div class="container">
	<button
		onclick={() => richtextContext.activeEditor.editor?.chain().focus().toggleSuperscript().run()}
		class:selected={richtextContext.activeEditor.editor?.isActive('subscript')}
		title="Superscript"
	>
		Super
	</button>
	<button
		onclick={() => richtextContext.activeEditor.editor?.chain().focus().toggleSubscript().run()}
		class:selected={richtextContext.activeEditor.editor?.isActive('superscript')}
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
