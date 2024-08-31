<script>
    import "../app.css";

    const names = ["Davicom", "vi", "Dmitri", "Arias", "Eric"]

    // shuffle names
    names.sort(() => Math.random() - 0.5);


    let nameString = ""

    names.forEach(
        (name, index) => {
            if (index === names.length - 1) {
                nameString += name
            } else if (index === names.length - 2) {
                nameString += name + " y "
            } else {
                nameString += name + ", "
            }
        }
    )

</script>

<slot />

<footer>
    <div class="bg-gray-800 text-white p-4 text-center">
        <p><strong>Monkey Box</strong> por 🐒🐒∞  &nbsp;  ({nameString})</p>

        <em>Segunda Hackathon Random Uchile 31/08/2024</em>
    </div>
</footer>