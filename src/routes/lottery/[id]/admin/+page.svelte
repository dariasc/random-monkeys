<script lang="ts">
	import type { PageData } from './$types';
	import HashGrid from '$lib/components/HashGrid.svelte';
	import { generateHashes, randomHex } from '$lib/crypto';
	import CountDown from '$lib/components/CountDown.svelte';

	export let data: PageData;

    const observers = [randomHex(16), randomHex(16)]
    const example = generateHashes(["1", "2", "3"])
    console.log(example)
</script>

<main class="bg-gray-100 flex items-center justify-center min-h-screen">

    <div class="text-center p-6 bg-white shadow-lg max-w-4xl rounded-lg w-full space-y-4">
        <div>
            <div class="text-3xl font-bold text-blue-600 mb-2 flex flex-row justify-center space-x-2">
                <h2>Sorteo:</h2>
                <h2 class="font-normal text-blue-500">$nombre</h2>
            </div>
        </div>

        <CountDown />
        
        <div class="space-y-2">
            <h2 class="text-2xl font-bold text-blue-600 mb-2">Observadores</h2>
            <div class="text-gray-500">Entrega uno de estos valores a cada uno de tus observadores.</div>
            <div class="grid grid-cols-1 gap-3 w-full">
                {#each observers as observer}
                    <pre
                        class="flex items-center justify-center p-4 bg-blue-100 rounded text-blue-800 w-full">{observer}</pre>
                {/each}
            </div>
        </div>

        <div>
            <h2 class="text-2xl font-bold text-blue-600 mb-2">Participantes</h2>
            {#await generateHashes(["1", "2", "3", "4", "5"])}
                " "
            {:then data}
                <HashGrid hashes={data} />
                
            {/await}
        </div>
	</div>
</main>
