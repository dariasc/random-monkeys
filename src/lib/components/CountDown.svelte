<script lang="ts">
    export let countdownDate = new Date().getTime() + (23 * 60 * 60 * 1000);
	let countdownTime = "Cargando...";

	const endDate = new Date(countdownDate);
    const endDateFormatted = endDate.toLocaleString("es-ES", {
        timeZoneName: "short"
    });

    const distance = countdownDate - new Date().getTime();
    if (distance > 0) {
        const countdownFunction = setInterval(function() {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            if (distance < 0) {
                clearInterval(countdownFunction);
                if(typeof window !== 'undefined') window.location.reload();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownTime =
                (days > 0 ? days + "d " : "") +
                ("0" + hours).slice(-2) + "h " +
                ("0" + minutes).slice(-2) + "m " +
                ("0" + seconds).slice(-2) + "s";
        }, 1);
    }
</script>

{#if distance > 0}
<div>
    <h1 id="countdown" class="text-5xl font-bold text-blue-600 mb-2">{countdownTime}</h1>

    <p class="text-sm text-gray-500 mb-6">
        Termina: <span id="raffle-end-date">{endDateFormatted}</span>
    </p>
</div>
{/if}