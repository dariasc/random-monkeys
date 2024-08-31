<script>
	export let hashes = [];
</script>

<div class="grid grid-cols-3 gap-3 w-full">
	{#each hashes as hash}
		<div class="hash-container flex flex-col items-center p-4 bg-blue-100 rounded text-blue-800 w-full">
			<div>{#if hash.salt}<strong>Hash: </strong>{/if}{hash.hash.slice(0, 16)}</div>
			<span class="tooltip">{hash.hash}</span>
			{#if hash.id}
				<div><strong>ID: </strong>{hash.id}</div>
			{/if}
			{#if hash.salt}
				<div><strong>Salt: </strong>{hash.salt}</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.hash-container {
		position: relative;
		display: inline-block;
	}

	.hash-container .tooltip {
		visibility: hidden;
		width: auto;
		background-color: #555;
		color: #fff;
		text-align: center;
		border-radius: 6px;
		padding: 5px;
		position: absolute;
		z-index: 1;
		bottom: 100%; /* Position the tooltip above the text */
		left: 50%;
		margin-left: -60px; /* Center the tooltip */
		opacity: 0;
		transition: opacity 0.3s;
		white-space: nowrap; /* Prevent tooltip text from wrapping */
	}

	.hash-container:hover .tooltip {
		visibility: visible;
		opacity: 1;
	}
</style>
