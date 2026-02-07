<script lang="ts">
	const { isTopHalf } = $props();
</script>

<div class="line-indicator" style:top={isTopHalf ? '0' : '100%'}></div>

<style>
	.line-indicator {
		position: absolute;
		height: 2px;
		background-color: blue;
		width: 100%;
		pointer-events: none;
		z-index: 2;
	}
</style>
