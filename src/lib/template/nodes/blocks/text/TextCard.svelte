<script lang="ts">
	import type { TextBlockEntity } from '$lib/template/types';
	import BlockCard from '../BlockCard.svelte';
	import IconText from '$lib/assets/icons/IconText.svelte';

	interface Props {
		entity: TextBlockEntity;
	}
	const { entity, ...props }: Props = $props();
</script>

<BlockCard text="Text" {...props}>
	{#snippet icon()}
		<IconText />
	{/snippet}
</BlockCard>
