<script lang="ts">
	import { getUIContext } from '$lib/template/contexts/uiContext.svelte';
	import { type RowEntity } from '$lib/template/types';
	import { stringifyCssObject } from '$lib/template/utils/stringifyCssObject';
	import NodeRenderer from '../../shared/NodeRenderer.svelte';

	interface Props {
		entity: RowEntity;
	}
	const { entity, ...props }: Props = $props();
	
	const uiStore = getUIContext();
	const shouldStack = $derived(uiStore.viewMode === 'mobile' && entity.isResponsive);
	const style = $derived(stringifyCssObject(entity.style))
</script>

<table width="100%" {style} {...props}>
	<tbody>
		<tr>
			{#each entity.columns as column, i}
				<td
					width={shouldStack ? '100%' : `${column.width}%`}
					style:display={shouldStack ? 'block' : 'table-cell'}
				>
					<NodeRenderer entity={column} />
				</td>

				{#if i < entity.columns.length - 1}
					<td
						style:min-width={shouldStack ? 'auto' : entity.separatorSize + 'px'}
						style:min-height={shouldStack ? 'auto' : entity.separatorSize + 'px'}
						style:display={shouldStack ? 'block' : 'table-cell'}
						style:width={shouldStack ? '100%' : entity.separatorSize + 'px'}
					>
					</td>
				{/if}
			{/each}
		</tr>
	</tbody>
</table>
