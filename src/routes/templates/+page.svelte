<script lang="ts">
	import { clickoutside } from '$lib/clickOutside/attachments/clickOutside.svelte';
	import { getClickOutsideContext } from '$lib/clickOutside/contexts/clickOutsideContext.svelte';
	import Canvas from '$lib/components/Canvas.svelte';
	import PropertiesPanel from '$lib/components/PropertiesPanel.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';
	import { getUIContext } from '$lib/template/contexts/uiContext.svelte';

	const clickOutsideContext = getClickOutsideContext();
	const uiContext = getUIContext();
</script>

<div
	class="editor"
	{@attach clickoutside({
		store: clickOutsideContext,
		onClick: () => {
			uiContext.selectedId = null;
		}
	})}
>
	<Topbar />
	<div class="body">
		<Canvas />
		<Sidebar />
		<PropertiesPanel />
	</div>
</div>

<style>
	.editor {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.body {
		display: flex;
		height: 100%;
		overflow: hidden;
		position: relative;
	}
</style>
