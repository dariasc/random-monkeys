<script lang="ts">
	import type { PageData } from './$types';
	import HashGrid from '$lib/components/HashGrid.svelte';
	import { verify, generateHashes } from '$lib/crypto';

	export let data: PageData;

	const hashes: string[] = []

	hashes.push("79c0ec3c19256af1bcaf6c4641bf77f1b45c3585ec1ba45cce4a15ab32ca9723");

	function random256BitsHexadecimal() {
		//todo: recordar pasar esto ordenadamente
		return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
	}

	async function getGoodHashSalt(rut) {
		return await generateHashes([rut]);
	}

	// for testing only!!
	for (let i = 0; i < 11; i++) {
		hashes.push(random256BitsHexadecimal());
	}

	async function verifyParticipation(rut: string, salt: string) {
		return await verify(hashes, rut, salt);
	}

	const countdownDate = new Date().getTime() + (23 * 60 * 60 * 1000);
	let countdownTime = "Cargando...";

	const endDate = new Date(countdownDate);
    const endDateFormatted = endDate.toLocaleString("es-ES", {
        timeZoneName: "short"
    });

    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

		countdownTime =
			(days > 0 ? days + "d " : "") +
			("0" + hours).slice(-2) + "h " +
			("0" + minutes).slice(-2) + "m " +
			("0" + seconds).slice(-2) + "s";

        if (distance < 0) {
            clearInterval(countdownFunction);
        }
    }, 1);


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

<main class="bg-gray-100 flex items-center justify-center min-h-screen">
	<div class="text-center p-6 bg-white shadow-lg max-w-xl rounded-lg w-full">
		<h1 id="countdown" class="text-5xl font-bold text-blue-600 mb-2">{countdownTime}</h1>

		<p class="text-sm text-gray-500 mb-6">
			Termina: <span id="raffle-end-date">{endDateFormatted}</span>
		</p>


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

		<h2 class="text-2xl font-bold text-blue-600 mb-2">Participantes:</h2>

		<HashGrid hashes={hashes} />
	</div>
</main>

