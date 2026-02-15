<script lang="ts">
	import BasicTextStyleFormats from "$lib/richtext/adapter/components/toolbar/BasicTextStyleFormats.svelte";
	import ClearFormats from "$lib/richtext/adapter/components/toolbar/ClearFormats.svelte";
	import EmojieSymbolFormats from "$lib/richtext/adapter/components/toolbar/EmojieSymbolFormats.svelte";
	import FontStyleFormats from "$lib/richtext/adapter/components/toolbar/FontStyleFormats.svelte";
	import HeadingsFormats from "$lib/richtext/adapter/components/toolbar/HeadingsFormats.svelte";
	import IndentFormats from "$lib/richtext/adapter/components/toolbar/IndentFormats.svelte";
	import LineHeightFormats from "$lib/richtext/adapter/components/toolbar/LineHeightFormats.svelte";
	import LinkFormats from "$lib/richtext/adapter/components/toolbar/LinkFormats.svelte";
	import OrderedListFormats from "$lib/richtext/adapter/components/toolbar/OrderedListFormats.svelte";
	import ScriptFormats from "$lib/richtext/adapter/components/toolbar/ScriptFormats.svelte";
	import TableFormats from "$lib/richtext/adapter/components/toolbar/TableFormats.svelte";
	import TextAlignmentFormats from "$lib/richtext/adapter/components/toolbar/TextAlignmentFormats.svelte";
	import TextDirectionFormats from "$lib/richtext/adapter/components/toolbar/TextDirectionFormats.svelte";
	import UnorderedListFormats from "$lib/richtext/adapter/components/toolbar/UnorderedListFormats.svelte";

</script>

<div class="container">
	<BasicTextStyleFormats />

	<ScriptFormats />

	<HeadingsFormats />

	<UnorderedListFormats />

	<OrderedListFormats />

	<TextAlignmentFormats />

	<TextDirectionFormats />

	<IndentFormats />

	<FontStyleFormats />

	<LineHeightFormats />

	<LinkFormats />

	<TableFormats />

	<EmojieSymbolFormats />

	<ClearFormats />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
        flex-wrap: wrap;
        overflow: hidden;
		gap: 4px;
	}
</style>
