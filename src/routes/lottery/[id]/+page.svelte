<script lang="ts">
	import type { PageData } from './$types';
	import HashGrid from '$lib/components/HashGrid.svelte';
	import { verify, generateHashes } from '$lib/crypto';
	import CountDown from '$lib/components/CountDown.svelte';

	export let data: PageData;

	function downloadCSV(): void {
        const csvContent = "data:text/csv;charset=utf-8,"
        + data.hashes.map(hash => `${hash.hash}`).join("\n");

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "hashes.csv");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

	async function verifyParticipation(rut: string, salt: string) {
		return await verify(data.hashes.map(obj => {return obj.hash}), rut, salt);
	}

	async function verifyWin(rut: string, salt: string) {
		return await verify(data.winners.map(obj => {return obj.hash}), rut, salt);
	}

	let rut = '';
	let salt = '';
	// let verificationResult: string | null = null;
	// boolean
	let verificationRun: boolean = false;
	let verificationResult: boolean = false;
	let didWinRun: boolean = false;
	let didWinResult: boolean = false;

	async function handleVerify() {
		verificationRun = true;
		if (rut && salt) {
			const result = await verifyParticipation(rut, salt);
			if (data.winners.length > 0) {
				await handleDidWin()
			}
			verificationResult = result;
		} else {
			verificationResult = false;
		}
	}

	async function handleDidWin() {
		didWinRun = true
		didWinResult = await verifyWin(rut, salt)
	}
</script>

<main class="bg-gray-100 flex items-center justify-center min-h-screen py-8">
	<div class="text-center p-6 bg-white shadow-lg max-w-4xl rounded-lg w-full space-y-8">
		<div>
            <div class="text-3xl font-bold text-blue-600 mb-2 flex flex-row justify-center space-x-2">
                <h2>Sorteo:</h2>
                <h2 class="font-normal text-blue-500">{data.name}</h2>
            </div>
        </div>
		
		{#if new Date(data.publishAt).getTime() - Date.now()  > 0}
			<CountDown countdownDate={data.publishAt} />
		{:else}
			<h2 class="text-xl font-bold text-blue-600 mb-2">Se usó el faro de {data.faro}</h2>
		{/if}


		<h2 class="text-2xl font-bold text-blue-600 mb-2">Verifica tu participación:</h2>

		<div class="flex items-center justify-center mb-6 space-x-4">
            <input
                type="text"
                placeholder="Identificador"
				bind:value={rut}
                class="p-2 border border-gray-300 rounded-md w-1/2"
            />
            <input
                type="text"
                placeholder="Salt"
				bind:value={salt}
                class="p-2 border border-gray-300 rounded-md w-1/2"
            />
			<button
				class="p-2 bg-blue-600 text-white rounded-md"
				on:click={handleVerify}
			>
				Verificar
			</button>
        </div>

		{#if verificationRun}
			<p class="text-xl font-bold mb-6" class:text-green-600={verificationResult} class:text-red-600={!verificationResult}>
				{#if verificationResult}
					Participación verificada con éxito.
				{:else}
					Verificación fallida. Por favor revisa tus datos.
				{/if}
			</p>
			{#if didWinRun && verificationResult}
				<p class="text-xl font-bold mb-6 text-gray-600 rounded-lg p-4" class:bg-green-100={didWinResult} class:bg-red-100={!didWinResult}>
					{#if didWinResult}
						Has sido seleccionado!
					{:else}
						No fuiste seleccionado.
					{/if}
				</p>
			{/if}
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

		{#if data.ids.length > 0}
        <div>
            <h2 class="text-2xl font-bold text-blue-600 mb-2">Identificadores</h2>
            <HashGrid hashes={data.ids} color='red' />      
        </div>
        {/if}

        <div class="p-3">
            <button 
                on:click={downloadCSV}
                class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Descargar hashes en .csv
            </button>
        </div>
	</div>
</main>

