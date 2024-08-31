<script lang="ts">
	import type { PageData } from './$types';
	import HashGrid from '$lib/components/HashGrid.svelte';
	// import { verify } from '$lib/crypto';

	export let data: PageData;

	const hashes: string[] = []

	function random256BitsHexadecimal() {
		//todo: recordar pasar esto ordenadamente
		return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
	}

	// for testing only!!
	for (let i = 0; i < 11; i++) {
		hashes.push(random256BitsHexadecimal());
	}

	function verifyParticipation(rut: string, salt: string) {
		return verify(hashes, rut, salt);
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
                class="p-2 border border-gray-300 rounded-md w-1/2"
            />
            <input
                type="text"
                placeholder="Salt"
                class="p-2 border border-gray-300 rounded-md w-1/2"
            />
        </div>

		<h2 class="text-2xl font-bold text-blue-600 mb-2">Participantes:</h2>

		<HashGrid hashes={hashes} />
	</div>
</main>
