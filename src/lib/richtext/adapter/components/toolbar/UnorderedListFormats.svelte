<script lang="ts">
	import { getRichtextContext } from '../../contexts/richtextContext.svelte';

	const richtextContext = getRichtextContext();
	const editor = $derived(richtextContext.activeEditor);
</script>

<div class="container">
	<button
		onclick={() => editor?.chain().focus().toggleBulletList('disc').run()}
		class:selected={editor?.isActive('bulletList', { listStyleType: 'disc' })}
		title="Bullet List - Disc"
	>
		DISC LIST
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleBulletList('circle').run()}
		class:selected={editor?.isActive('bulletList', { listStyleType: 'circle' })}
		title="Bullet List - Circle"
	>
		CIRCLE LIST
	</button>
	<button
		onclick={() => editor?.chain().focus().toggleBulletList('square').run()}
		class:selected={editor?.isActive('bulletList', { listStyleType: 'square' })}
		title="Bullet List - Square"
	>
		SQUARE LIST
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
