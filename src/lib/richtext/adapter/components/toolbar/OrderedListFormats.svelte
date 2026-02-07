<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
</script>

<div class="container">
	<button
		onclick={() =>
			richtextContext.activeEditor.editor?.chain().focus().toggleOrderedList('decimal').run()}
		class:selected={richtextContext.activeEditor.editor?.isActive('orderedList', {
			listStyleType: 'decimal'
		})}
		title="Ordered List - 1, 2, 3"
	>
		DECIMAL LIST
	</button>
	<button
		onclick={() =>
			richtextContext.activeEditor.editor?.chain().focus().toggleOrderedList('lower-alpha').run()}
		class:selected={richtextContext.activeEditor.editor?.isActive('orderedList', {
			listStyleType: 'lower-alpha'
		})}
		title="Ordered List - a, b, c"
	>
		LOWER ALPHA LIST
	</button>
	<button
		onclick={() =>
			richtextContext.activeEditor.editor?.chain().focus().toggleOrderedList('upper-alpha').run()}
		class:selected={richtextContext.activeEditor.editor?.isActive('orderedList', {
			listStyleType: 'upper-alpha'
		})}
		title="Ordered List - A, B, C"
	>
		UPPER ALPHA LIST
	</button>
	<button
		onclick={() =>
			richtextContext.activeEditor.editor?.chain().focus().toggleOrderedList('lower-roman').run()}
		class:selected={richtextContext.activeEditor.editor?.isActive('orderedList', {
			listStyleType: 'lower-roman'
		})}
		title="Ordered List - i, ii, iii"
	>
		LOWER ROMAN LIST
	</button>
	<button
		onclick={() =>
			richtextContext.activeEditor.editor?.chain().focus().toggleOrderedList('upper-roman').run()}
		class:selected={richtextContext.activeEditor.editor?.isActive('orderedList', {
			listStyleType: 'upper-roman'
		})}
		title="Ordered List - I, II, III"
	>
		UPPER ROMAN LIST
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
