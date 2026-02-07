<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
	const editor = $derived(richtextContext.activeEditor);
</script>

<div class="container">
	<button onclick={() => editor?.chain().focus().unsetAllMarks().run()} title="Clear Formatting">
		CLEAR
	</button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 4px;
	}
</style>
