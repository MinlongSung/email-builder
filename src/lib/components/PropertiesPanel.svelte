<script lang="ts">
	import { fly } from 'svelte/transition';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { getUIContext } from '$lib/template/contexts/uiContext.svelte';
	import { ignoreclickoutside } from '$lib/clickOutside/attachments/ignoreClickOutside.svelte';
	import { getClickOutsideContext } from '$lib/clickOutside/contexts/clickOutsideContext.svelte';
	import NodeRenderer from '$lib/template/nodes/shared/NodeRenderer.svelte';

	const uiContext = getUIContext();
	const templateContext = getTemplateContext();
	const clickOutsideContext = getClickOutsideContext();
	const node = $derived(uiContext.selectedId ? templateContext.getNode(uiContext.selectedId) : null);
</script>

{#if node}
	<aside
		{@attach ignoreclickoutside({
			store: clickOutsideContext
		})}
		class="propertiesPanel"
		transition:fly={{ x: 320, duration: 250 }}
	>
		<NodeRenderer entity={node} format="propertiesPanel" />
	</aside>
{/if}

<style>
	.propertiesPanel {
		position: absolute;
		right: 0;
		top: 40px;
		bottom: 0;
		width: 320px;
		background: #fff;
		border: 1px solid #e0e0e0;
		z-index: 10;
		overflow-y: auto;
	}
</style>
