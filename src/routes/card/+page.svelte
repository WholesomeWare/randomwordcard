<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { getWordPacks } from "$lib/firebase/wordPackProvider";
    import { mdiCog, mdiDelete, mdiRefresh } from "@mdi/js";
    import { firestoreCard } from "$lib/firebase/FirestoreCard.svelte";
    import IconButton from "$lib/components/IconButton.svelte";
    import Fab from "$lib/components/Fab.svelte";
    import { getWords } from "$lib/wordsProvider";

    let card = $state(firestoreCard(null));

    let randomColor = $state("white");
    let randomWords: string[] = $state([]);

    onMount(() => {
        card = firestoreCard($page.url.searchParams.get("cardId"));

        randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

        getWords(card, (words) => {
            randomWords = words;
            card.value.history = [words.join(", "), ...card.value.history];
        });
    });
</script>

<main>
    <div class="card" style="background-color: {randomColor};">
        <div class="card-words">
            {#each randomWords as word}
                <h1>{word}</h1>
            {/each}
        </div>
        <div class="card-actions">
            <IconButton path={mdiRefresh} size={32} onclick={() => location.reload()} />
            <IconButton
                path={mdiCog}
                size={32}
                onclick={() =>
                    (window.location = `./settings/?cardId=${$page.url.searchParams.get("cardId")}`)}
            />
        </div>
    </div>

    <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <h2>Előzmények</h2>
    
        <IconButton
            path={mdiDelete}
            color="white"
            onclick={() => (card.value = { ...card.value, history: [] })}
        />
    </div>

    {#each card.value.history as history}
        <p>{history}</p>
    {/each}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }

    .card {
        position: relative;
        width: 100%;
        border-radius: 1rem;
    }

    .card-actions {
        display: flex;
        flex-direction: row;
        padding: 0.5rem;
        gap: 0.5rem;
        position: absolute;
        top: 0;
        right: 0;
        opacity: .3;
    }

    .card-words {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        padding: 1rem;
        text-align: center;

        height: calc(100svh - 2rem);
    }
</style>
