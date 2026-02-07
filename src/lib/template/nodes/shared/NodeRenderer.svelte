<script lang="ts">
	import type { NodeEntity } from '$lib/template/types';
	import { nodeRegistry, type RenderFormat } from '../nodeRegistry';

	interface Props {
		entity: NodeEntity;
		format?: RenderFormat;
	}
	const { entity, format = 'canvas', ...props }: Props = $props();

	const NodeComponent = $derived(nodeRegistry.getComponent(entity.type, format));
</script>

{#if NodeComponent}
	<NodeComponent {entity} {...props} />
{:else}
	<div style="color: red; padding: 1rem; border: 1px solid red;">
		No renderer for {entity.type} in format: {format}
	</div>
{/if}
