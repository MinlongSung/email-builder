<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const prosemirrorContext = getRichtextContext();
	const editor = $derived(prosemirrorContext.activeEditor);
</script>

<div class="container">
	<button onclick={() => editor?.chain().focus().unsetAllMarks().run()} title="Clear Formatting">
		CLEAR
	</button>
</div>

<style>
	.container {
		display: 'flex';
		flex-direction: 'row';
		gap: 4;
	}
</style>
