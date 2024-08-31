<script>
	import Dado from '$lib/components/Dado.svelte';

	let selectedDate = '';
	let selectedTime = '';
	let selectedPrivacy = 'public'; // Initialize privacy

	let selectedOffsetHours = 0; // Initialize offset hours
	let selectedOffsetMinutes = 0; // Initialize offset minutes

	function autoResize(event) {
		const textarea = event.target;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}
</script>

<main class="bg-gray-100 flex items-center justify-center min-h-screen">
	<form
		class="text-center p-6 bg-white shadow-lg max-w-3xl rounded-lg w-full flex flex-col"
		method="POST"
		action="?/create"
	>
		<h1 class="text-5xl font-bold text-blue-600 mb-2 flex flex-row justify-center">
			<div class="flex flex-row text-center">
				<Dado />Bienvenido a Monkey Box<Dado />
			</div>
		</h1>

		<h2 class="text-4xl font-bold mt-5 text-blue-400 mb-2">Crea tu sorteo:</h2>

		<div class="flex items-center justify-start mb-6 space-x-4">
			<input
				id="nombre"
				name="nombre"
				type="text"
				placeholder="Nombre de Sorteo"
				class="p-2 border border-gray-300 rounded-md w-1/2"
				required
			/>

			<input
				id="numGanadores"
				name="numGanadores"
				type="number"
				placeholder="Número de Ganadores"
				class="p-2 border border-gray-300 rounded-md w-1/2"
				required
			/>
		</div>

		<div class="flex justify-center gap-4">
			<div>
				<label for="offset-hours" class="block text-blue-500 mb-1">Offset Hours:</label>
				<input
					id="offset-hours"
					name="offsetHours"
					type="number"
					bind:value={selectedOffsetHours}
					class="border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white custom-width"
					min="0"
					required
				/>
			</div>

			<div>
				<label for="offset-minutes" class="block text-blue-500 mb-1">Offset Minutes:</label>
				<input
					id="offset-minutes"
					name="offsetMinutes"
					type="number"
					bind:value={selectedOffsetMinutes}
					class="border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 custom-width"
					min="0"
					max="59"
					required
				/>
			</div>
			
			<div>
				<label for="privacy" class="block text-blue-500 mb-1">Privacy:</label>
				<select
					id="privacy"
					name="privacy"
					bind:value={selectedPrivacy}
					class="border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				>
					<option value="public">Público</option>
					<option value="semi-private">Semi-Público</option>
					<option value="private">Privado</option>
				</select>
			</div>
		</div>

		<div class="flex justify-around flex-col mt-8 gap-4">
			<h2 class="text-2xl font-bold text-blue-600 mb-2">Listado de participantes:</h2>
			<textarea
				on:input={autoResize}
				id="ids"
				name="ids"
				placeholder="Identificadores de Participantes (uno por línea)"
				class="p-2 border border-gray-300 rounded-md w-full h-auto"
				required
			/>
		</div>

		<button
			type="submit"
			class="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg mt-6 hover:bg-blue-600"
			>Publicar</button
		>
	</form>
</main>

<style>
	.gif {
		vertical-align: middle;
	}

	.custom-width {
		width: 120px; /* Or whatever width you want */
	}
</style>
