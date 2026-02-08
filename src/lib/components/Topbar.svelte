<script lang="ts">
	import { ignoreclickoutside } from '$lib/clickOutside/attachments/ignoreClickOutside.svelte';
	import { getClickOutsideContext } from '$lib/clickOutside/contexts/clickOutsideContext.svelte';
	import { historyService } from '$lib/history/HistoryService.svelte';
	import { getUIContext } from '$lib/template/contexts/uiContext.svelte';

	const uiContext = getUIContext();
	const clickOutsideContext = getClickOutsideContext();
</script>

<header class="topbar" {@attach ignoreclickoutside({ store: clickOutsideContext })}>
	<button onclick={() => (uiContext.viewMode = 'desktop')}>Desktop</button>
	<button onclick={() => (uiContext.viewMode = 'mobile')}>Mobile</button>
	<button onclick={() => historyService.undo()} disabled={!historyService.canUndo()}>Undo</button>
	<button onclick={() => historyService.redo()} disabled={!historyService.canRedo()}>Redo</button>
</header>

<style>
	.topbar {
		display: flex;
		height: 50px;
		border-bottom: 1px solid #e0e0e0;
	}
</style>
