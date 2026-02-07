<script lang="ts">
	const { isOver } = $props();
</script>

<div class="placeholder">
	<div class="placeholder-text">
		{isOver ? "Dropping" : "Drop here"}
	</div>
</div>

<style>
	.placeholder {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		justify-content: center;
		background-color: blue;
		color: white;
		min-height: 96px;
	}
	.placeholder-text {
		position: absolute;
	}
</style>