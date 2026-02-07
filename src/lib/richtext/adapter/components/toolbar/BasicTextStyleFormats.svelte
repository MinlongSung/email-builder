<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
</script>

<div class="container">
	<button
		onclick={() => richtextContext.activeEditor.editor?.chain().focus().toggleBold().run()}
		class:selected={richtextContext.activeEditor.editor?.isActive('bold')}
		title="Bold (Ctrl+B)"
	>
		B
	</button>
	<button
		onclick={() => richtextContext.activeEditor.editor?.chain().focus().toggleItalic().run()}
		class:selected={richtextContext.activeEditor.editor?.isActive('italic')}
		title="Italic (Ctrl+I)"
	>
		I
	</button>
	<button
		onclick={() => richtextContext.activeEditor.editor?.chain().focus().toggleUnderline().run()}
		class:selected={richtextContext.activeEditor.editor?.isActive('underline')}
		title="Underline (Ctrl+U)"
	>
		U
	</button>
	<button
		onclick={() => richtextContext.activeEditor.editor?.chain().focus().toggleStrike().run()}
		class:selected={richtextContext.activeEditor.editor?.isActive('strike')}
		title="Strikethrough"
	>
		S
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
