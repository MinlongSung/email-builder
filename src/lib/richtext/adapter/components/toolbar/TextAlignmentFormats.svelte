<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
	const editor = $derived(richtextContext.activeEditor.editor);
</script>

<div class="container">
	<button
		onclick={() => editor?.chain().focus().toggleTextAlign('left').run()}
		class:selected={editor?.isActive({ textAlign: 'left' })}
		title="Align Left"
	>
		ALIGN LEFT
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleTextAlign('center').run()}
		class:selected={editor?.isActive({ textAlign: 'center' })}
		title="Align Center"
	>
		ALIGN CENTER
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleTextAlign('right').run()}
		class:selected={editor?.isActive({ textAlign: 'right' })}
		title="Align Right"
	>
		ALIGN RIGHT
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleTextAlign('justify').run()}
		class:selected={editor?.isActive({ textAlign: 'justify' })}
		title="Justify"
	>
		ALIGN JUSTIFY
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
