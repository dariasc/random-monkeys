<script>
  let selectedDate = '';
  let selectedTime = '';
</script>
<style>
  .gif {
      vertical-align: middle;
  }
</style>

<main class="bg-gray-100 flex items-center justify-center min-h-screen">
	<div class="text-center p-6 bg-white shadow-lg max-w-5xl rounded-lg w-full">
		<h1 class="text-5xl font-bold text-blue-600 mb-2 flex flex-row">
      <div class="text-center">Bienvenido a Monkey Box <img src="dado.gif" alt="dado mágico" class="gif h-32" /></div>
    </h1>
		<h1 class="text-4xl font-bold text-blue-400 mb-2">Crea tu sorteo:</h1>
		<div class="flex items-center justify-center mb-6 space-x-4">
            <input
                type="text"
                placeholder="Numero de Observadores"
                class="p-2 border border-gray-300 rounded-md w-1/2"
            />
            <input
                type="text"
                placeholder="Número de Ganadores"
                class="p-2 border border-gray-300 rounded-md w-1/2"
            />
        </div>
    <div class="flex items-center space-x-4">
        <!-- Date Selector -->
        <div>
            <label for="date-input" class="block text-blue-500 mb-1">Fecha:</label>
            <input 
                id="date-input" 
                type="date" 
                bind:value={selectedDate}
                class="border border-gray-300 rounded-lg py-2 px-4 text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
        </div>

        <!-- Time Selector -->
        <div>
            <label for="time-input" class="block text-blue-500 mb-1">Hora:</label>
            <input 
                id="time-input" 
                type="time" 
                bind:value={selectedTime}
                class="border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    </div>
	</div>
</main>