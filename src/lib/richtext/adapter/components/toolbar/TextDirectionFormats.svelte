<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
	const editor = $derived(richtextContext.activeEditor.editor);
</script>

<div class="container">
	<button
		onclick={() => editor?.commands.setTextDirection('ltr')}
		class:selected={editor?.isActive({ dir: 'ltr' })}
		title="Left to Right"
	>
		LTR
	</button>
	<button
		onclick={() => editor?.commands.setTextDirection('rtl')}
		class:selected={editor?.isActive({ dir: 'rtl' })}
		title="Right to Left"
	>
		RTL
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
