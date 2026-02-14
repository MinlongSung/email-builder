<script lang="ts">
	import { type ColumnEntity } from '$lib/template/types';

	interface Props {
		entity: ColumnEntity;
	}
	const { entity, ...props }: Props = $props();
</script>

<div class="column" {...props}></div>

<style>
	.column {
		height: 40px;
		width: 40px;
		background-color: purple;
	}
</style>
