<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const prosemirrorContext = getRichtextContext();
	const editor = $derived(prosemirrorContext.activeEditor);
	const editorState = $derived.by(() => ({
		marks: {
			bold: editor?.isActive('bold'),
			italic: editor?.isActive('italic'),
			underline: editor?.isActive('underline'),
			strike: editor?.isActive('strike')
		}
	}));
</script>

<div class="container">
	<button
		onclick={() => editor?.chain().focus().toggleBold().run()}
		class:selected={editorState?.marks.bold}
		title="Bold (Ctrl+B)"
	>
		B
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleItalic().run()}
		class:selected={editorState?.marks.italic}
		title="Italic (Ctrl+I)"
	>
		I
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleUnderline().run()}
		class:selected={editorState?.marks.underline}
		title="Underline (Ctrl+U)"
	>
		U
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleStrike().run()}
		class:selected={editorState?.marks.strike}
		title="Strikethrough"
	>
		S
	</button>
</div>

<style>
	.container {
		display: 'flex';
		flex-direction: 'row';
		gap: 4;
	}

	.selected {
		background-color: red;
	}
</style>
