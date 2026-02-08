<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
	const editor = $derived(richtextContext.activeEditor);
</script>

<div class="container">
	<button
		onclick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
		title="Insert Table"
	>
		TABLE
	</button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		gap: 4px;
	}
</style>
