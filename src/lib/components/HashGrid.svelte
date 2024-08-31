<script>
	export let hashes = [];
</script>

<div class="grid grid-cols-3 gap-3 w-full">
	{#each hashes as hash}
		<pre
			class="flex items-center justify-center p-4 bg-blue-100 rounded text-blue-800 w-full">{hash}</pre>
	{/each}
</div>