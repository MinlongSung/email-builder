<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon: Snippet;
		text: string;
	}

	const { icon, text, ...props }: Props = $props();
</script>

<div class="card" {...props}> <!-- pass attachment -->
	<div class="card__icon">
		{@render icon()}
	</div>
	<div class="card__text">{text}</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-self: center;
		width: 100px;
		border: 1px solid black;
	}

	.card__icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card__text {
		text-align: center;
	}
</style>
