<script>
    import Fab from "$lib/components/Fab.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Panel from "$lib/components/Panel.svelte";
    import { mdiRefresh } from "@mdi/js";
    import { text } from "@sveltejs/kit";

    const words = [
        "dobókocka",
        "társasjáték",
        "lottó",
        "szerencse",
        "véletlen",
        "kockáztatás",
        "esély",
        "valószínűség",
        "fogadás",
        "rulet",
        "kaszinó",
        "jóslat",
        "megérzés",
        "improvizáció",
        "kaland",
        "felfedezés",
        "meglepetés",
        "izgalom",
        "feszültség",
        "kihívás",
        "szerencsejáték",
        "káoosz",
        "rendetlenség",
        "zűrzavar",
        "váratlan fordulat",
        "balszerencse",
        "sors",
        "karma",
        "hiba",
        "tévedés",
        "katasztrófa",
        "végzet",
        "csoda",
        "rejtély",
        "paradoxon",
        "dilemma",
    ];

    let randomWord = $state(words[Math.floor(Math.random() * words.length)]);
</script>

<main>
    <h1>Random Szókártya</h1>

    <p>Érintsd a telefonod egy kártyához a kezdéshez.</p>

    <p>Nincs kártyád? Itt egy random szó:</p>

    <Panel>
        <p style="text-align: center;">{randomWord}</p>
    </Panel>

    <Fab
        iconPath={mdiRefresh}
        text="Új szó"
        onclick={() =>
            (randomWord = words[Math.floor(Math.random() * words.length)])}
    />

    <p>
        A projekt jelenleg béta fázisban van, ezért még nincsenek eladó kártyák.
        Kövesd a WholesomeWare Insta oldalát, hogy értesülj az újdonságokról!
    </p>
</main>

<Footer />

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 1rem;
    }
</style>
