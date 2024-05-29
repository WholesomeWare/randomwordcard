<script>
    import { onMount } from "svelte";
    import {
        firestoreWordPack,
        FirestoreWordPack,
    } from "$lib/firebase/FirestoreWordPack.svelte";
    import Fab from "$lib/components/Fab.svelte";
    import { mdiArrowLeft, mdiContentSave } from "@mdi/js";

    let cardId = $state("");
    let wordPackId = $state("");
    let wordPack = $state(firestoreWordPack(null));

    $effect(() => {
        if (wordPack.isReady && wordPack.value.ownerCardId !== cardId) {
            alert(
                `You are not the owner of this word pack.\n${wordPack.value.ownerCardId} !== ${cardId}`,
            );
        }
    });

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        cardId = urlParams.get("cardId") || "";
        wordPackId = urlParams.get("wordPackId") || "";
        wordPack = firestoreWordPack(wordPackId);
        wordPack.doAutoUpdate = false;
    });
</script>

<main>
    <input class="title" type="text" bind:value={wordPack.value.name} />
    <textarea
        rows="3"
        oninput={(e) => {
            wordPack.value = {
                ...wordPack.value,
                description: e.target.value.trim(),
            };
        }}>{wordPack.value.description}</textarea
    >
    <textarea
        rows="10"
        oninput={(e) => {
            wordPack.value = {
                ...wordPack.value,
                words: e.target.value.trim().split("\n"),
            };
        }}>{wordPack.value.words.join("\n")}</textarea
    >
    <Fab
        iconPath={mdiContentSave}
        text="Mentés"
        onclick={() => {
            wordPack.updateDatabase();
        }}
    />
    <Fab
        iconPath={mdiArrowLeft}
        text="Vissza a kártyához"
        onclick={() => {
            window.location = `/card/settings/?cardId=${cardId}`;
        }}
    />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
    }

    .title {
        font-size: 2rem;
    }
</style>
