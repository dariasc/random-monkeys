<script lang="ts">
	import type { PageData } from './$types';
	import HashGrid from '$lib/components/HashGrid.svelte';
	import CountDown from '$lib/components/CountDown.svelte';

	export let data: PageData;

	function downloadCSV(): void {
        const csvContent = "data:text/csv;charset=utf-8,"
        + "id,hash,salt\n"
        + data.hashes.map(
            hash => `${hash.id},${hash.hash},${hash.salt}`
        ).join("\n");

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "hashes.csv");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function observerLink() {
        if (typeof window !== "undefined") {
            return `${window.location.origin}/lottery/${data.id}/admin/${data.observer}`
        }
        return ""
    }

    function copyObserver() {
        navigator.clipboard.writeText(observerLink())
    }
</script>

<main class="bg-gray-100 flex items-center justify-center min-h-screen py-8">
    <div class="text-center p-6 bg-white shadow-lg max-w-4xl rounded-lg w-full space-y-6">
        <div>
            <div class="text-3xl font-bold text-blue-600 mb-2 flex flex-row justify-center space-x-2">
                <h2>Sorteo:</h2>
                <h2 class="font-normal text-blue-500">$nombre</h2>
            </div>
        </div>

        <CountDown />
        
        {#if data.isAdmin}
        <div class="space-y-2">
            <h2 class="text-2xl font-bold text-blue-600 mb-2">Observador</h2>
            <div class="text-gray-500">Entrega este valor a cada uno de tus observadores.</div>
            <div class="grid grid-cols-1 gap-3 w-full">
                <button
                    on:click={copyObserver}
                    class="hover:bg-blue-200 flex items-center justify-center p-4 bg-blue-100 rounded text-blue-800 w-full">
                    {observerLink()}
                </button>
            </div>
        </div>
        {/if}

        {#if data.winners.length > 0}
        <div>
            <h2 class="text-2xl font-bold text-blue-600 mb-2">Ganadores</h2>
            <HashGrid hashes={data.winners} color='green' />      
        </div>
        {/if}

        <div>
            <h2 class="text-2xl font-bold text-blue-600 mb-2">Participantes</h2>
            <HashGrid hashes={data.hashes} />      
        </div>

        <div class="p-3">
            <button 
                on:click={downloadCSV}
                class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Descargar datos en .csv
            </button>
        </div>
	</div>
</main>
