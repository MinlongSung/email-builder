<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
	const editor = $derived(richtextContext.activeEditor);
</script>

<div class="container">
	<button
		onclick={() => editor?.chain().focus().toggleBold().run()}
		class:selected={editor?.isActive('bold')}
		title="Bold (Ctrl+B)"
	>
		B
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleItalic().run()}
		class:selected={editor?.isActive('italic')}
		title="Italic (Ctrl+I)"
	>
		I
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleUnderline().run()}
		class:selected={editor?.isActive('underline')}
		title="Underline (Ctrl+U)"
	>
		U
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleStrike().run()}
		class:selected={editor?.isActive('strike')}
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
