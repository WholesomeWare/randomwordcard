<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { getWordPacks } from "$lib/firebase/wordPackProvider";
    import { mdiCog, mdiRefresh } from "@mdi/js";
    import Icon from "$lib/components/Icon.svelte";
    import {
        FirestoreCard,
        firestoreCard,
    } from "$lib/firebase/FirestoreCard.svelte";
    import { goto } from "$app/navigation";
    import IconButton from "$lib/components/IconButton.svelte";

    let cardId: string | null = null;
    let card: FirestoreCard | null = null;

    let randomColor = "white";
    let randomWords: string[] = [];

    onMount(() => {
        cardId = $page.url.searchParams.get("cardId");
        if (cardId === null) {
            throw new Error("cardId is required");
        }
        card = firestoreCard(cardId);
        if (card === null) {
            throw new Error("card not found");
        }

        randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

        getWordPacks((wordPacks) => {
            randomWords =
                card?.value?.activeWordPacks
                    .map((wordPackId) => {
                        const words: string[] =
                            wordPacks.find(
                                (wordPack) => wordPack.id === wordPackId,
                            )?.words ?? [];

                        return words[Math.floor(Math.random() * words.length)];
                    })
                    .filter((word) => word !== undefined) ?? [];
        });
    });
</script>

<div class="card" style="background-color: {randomColor};">
    <div class="card-words">
        {#each randomWords as word}
            <h1>{word}</h1>
        {/each}
    </div>
    <div class="card-actions">
        <IconButton path={mdiRefresh} on:click={() => location.reload()} />
        <IconButton
            path={mdiCog}
            on:click={() => (window.location = `./settings/?cardId=${cardId}`)}
        />
    </div>
</div>

<style>
    .card {
        position: relative;
        margin: 1rem;
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
    }

    .card-words {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;

        width: 100%;
        height: calc(100svh - 2rem);
    }
</style>
