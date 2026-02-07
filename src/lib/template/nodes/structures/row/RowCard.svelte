<script lang="ts">
	import type { RowEntity } from '$lib/template/types';

	interface Props {
		entity: RowEntity;
	}
	const { entity, ...props }: Props = $props();
</script>

<div class="row" {...props}>
	{#each entity.columns as column (column.id)}
		<div class="column" style:flex={column.width}></div>
	{/each}
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 4px;
		padding: 5px;
		border: 1px solid black;
		background-color: white;
		min-width: 200px;
	}

	.column {
		height: 25px;
		background-color: purple;
	}
</style>
