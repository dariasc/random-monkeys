<script lang="ts">
	import type { PageData } from './$types';
	import HashGrid from '$lib/components/HashGrid.svelte';
	import { verify, generateHashes } from '$lib/crypto';
	import CountDown from '$lib/components/CountDown.svelte';

	export let data: PageData;

	async function verifyParticipation(rut: string, salt: string) {
		return await verify(data.hashes.map(obj => {return obj.hash}), rut, salt);
	}

	let rut = '';
	let salt = '';
	// let verificationResult: string | null = null;
	// boolean
	let verificationRun: boolean = false;
	let verificationResult: boolean = false;

	async function handleVerify() {
		verificationRun = true;
		if (rut && salt) {
			const result = await verifyParticipation(rut, salt);
			// verificationResult = result ? "Participación verificada con éxito." : "Verificación fallida. Por favor revisa tus datos.";
			verificationResult = result;
		} else {
			// verificationResult = "Por favor ingrese RUT y Salt.";
			verificationResult = false;
		}
	}
</script>

<main class="bg-gray-100 flex items-center justify-center min-h-screen py-8">
	<div class="text-center p-6 bg-white shadow-lg max-w-4xl rounded-lg w-full space-y-8">
		{#if new Date(data.countdownDate).getTime() - Date.now()  > 0}
			<CountDown countdownDate={data.countdownDate} />
		{:else}
			<p>Este sorteo ya ocurrió</p>
		{/if}


		<h2 class="text-2xl font-bold text-blue-600 mb-2">Verifica tu participación:</h2>

		<div class="flex items-center justify-center mb-6 space-x-4">
            <input
                type="text"
                placeholder="RUT"
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
		{/if}

		<div>
			<h2 class="text-2xl font-bold text-blue-600 mb-2">Participantes:</h2>
			<HashGrid hashes={data.hashes} />
		</div>


        {#if data.winners.length > 0}
        <div>
            <h2 class="text-2xl font-bold text-blue-600 mb-2">Ganadores</h2>
            <HashGrid hashes={data.winners} />      
        </div>
        {/if}
	</div>
</main>

