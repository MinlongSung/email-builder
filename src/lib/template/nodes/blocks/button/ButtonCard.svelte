<script lang="ts">
	import type { ButtonBlockEntity } from '$lib/template/types';
	import BlockCard from '../BlockCard.svelte';
	import IconButton from '$lib/assets/icons/IconButton.svelte';

	interface Props {
		entity: ButtonBlockEntity;
	}
	const { entity, ...props }: Props = $props();
</script>

<BlockCard text={'button'} {...props}>
	{#snippet icon()}
		<IconButton />
	{/snippet}
</BlockCard>
