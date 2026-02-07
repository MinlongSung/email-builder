<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
  const editor = $derived(richtextContext.activeEditor);
</script>

<div class="container">
	<button
		onclick={() => editor?.chain().focus().setParagraph().run()}
		class:selected={editor?.isActive('paragraph')}
		title="Paragraph"
	>
		P
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
		class:selected={editor?.isActive('heading', { level: 1 })}
		title="Heading 1"
	>
		H1
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
		class:selected={editor?.isActive('heading', { level: 2 })}
		title="Heading 2"
	>
		H2
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
		class:selected={editor?.isActive('heading', { level: 3 })}
		title="Heading 3"
	>
		H3
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
		class:selected={editor?.isActive('heading', { level: 4 })}
		title="Heading 4"
	>
		H4
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()}
		class:selected={editor?.isActive('heading', { level: 5 })}
		title="Heading 5"
	>
		H5
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleHeading({ level: 6 }).run()}
		class:selected={editor?.isActive('heading', { level: 6 })}
		title="Heading 6"
	>
		H6
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
