<script lang="ts">
	import { scrollable } from '$lib/dnd/adapter/attachments/scrollable.svelte';
	import { getDndContext } from '$lib/dnd/adapter/contexts/dndContext.svelte';
	import BlocksTab from './sidebarTabs/BlocksTab.svelte';
	import RowsTab from './sidebarTabs/RowsTab.svelte';
	import SettingsTab from './sidebarTabs/SettingsTab.svelte';

	type Tab = 'blocks' | 'rows' | 'settings';

	let activeTab = $state<Tab>('blocks');

	const tabs = $state<{ id: Tab; label: string }[]>([
		{ id: 'blocks', label: 'Blocks' },
		{ id: 'rows', label: 'Rows' },
		{ id: 'settings', label: 'Settings' }
	]);

	const dndStore = getDndContext();
</script>

<aside class="sidebar">
	<div class="tabs">
		{#each tabs as tab}
			<button class="tab" class:active={activeTab === tab.id} onclick={() => (activeTab = tab.id)}>
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="tab-content" {@attach scrollable({ manager: dndStore.manager, id: 'sidebar' })}>
		{#if activeTab === 'blocks'}
			<BlocksTab />
		{:else if activeTab === 'rows'}
			<RowsTab />
		{:else if activeTab === 'settings'}
			<SettingsTab />
		{/if}
	</div>
</aside>

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		flex-basis: 320px;
		border-left: 1px solid #e0e0e0;
	}

	.tabs {
		display: flex;
		border-bottom: 1px solid #e0e0e0;
	}

	.tab {
		flex: 1;
		padding: 12px 16px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		color: #666;
		transition: all 0.2s;
		position: relative;
	}

	.tab.active {
		color: #3b82f6;
	}

	.tab.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background-color: #3b82f6;
	}

	.tab-content {
		overflow-y: auto;
		padding: 16px;
	}
</style>
