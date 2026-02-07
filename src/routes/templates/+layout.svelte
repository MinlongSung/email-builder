<script lang="ts">
	import type { LayoutProps } from './$types';
	import TemplateProvider from '$lib/providers/TemplateProvider.svelte';

	const { data, children }: LayoutProps = $props();
</script>

{#await data.templatePromise}
	<div class="loading-square"></div>
{:then template}
	<TemplateProvider {template}>
		{@render children()}
	</TemplateProvider>
{/await}

<style>
	.loading-square {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100px;
		height: 100px;
		background: red;
	}
</style>
