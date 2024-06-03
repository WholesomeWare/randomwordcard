<script lang="ts">
    import { onMount } from "svelte";
    import {
        firestoreWordPack,
        FirestoreWordPack,
    } from "$lib/firebase/FirestoreWordPack.svelte";
    import Fab from "$lib/components/Fab.svelte";
    import { mdiArrowLeft, mdiContentSave } from "@mdi/js";
    import TopAppBar from "$lib/components/TopAppBar.svelte";
    import { WORDPACK_TAG_PUBLIC } from "$lib/model/WordPack";

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

    function save(callback: (isSuccessful: boolean) => void) {
        wordPack.updateDatabase((isSuccessful) => {
            callback(isSuccessful);
        });
    }
</script>

<div class="page">
    <TopAppBar
        title="Csomag szerkesztése"
        onback={() => {
            if (confirm("Szeretnél menteni?")) {
                save((isSuccessful) => {
                    if (isSuccessful) {
                        window.location = `/card/settings/?cardId=${cardId}`;
                    } else {
                        alert("Hiba történt a mentés során.");
                    }
                });
            } else {
                window.location = `/card/settings/?cardId=${cardId}`;
            }
        }}
    />

    <main>
        <input
            placeholder="Csomag neve"
            class="title"
            type="text"
            bind:value={wordPack.value.name}
        />
        <h3>Leírás</h3>
        <textarea
            placeholder="Leírás..."
            rows={4}
            oninput={(e) => {
                wordPack.value = {
                    ...wordPack.value,
                    description: e.target.value.trim(),
                };
            }}>{wordPack.value.description}</textarea
        >
        <h3>Kölcsönzők (1 kölcsönző / sor)</h3>
        {#if wordPack.value.tags.includes(WORDPACK_TAG_PUBLIC)}
            <p>Belpített kártya nem kölcsönözhető.</p>
        {:else}
            <textarea
                placeholder="Kölcsönző kártyák azonosítója soronként"
                rows={4}
                oninput={(e) => {
                    wordPack.value = {
                        ...wordPack.value,
                        enabledCardIds: e.target.value.trim().split("\n"),
                    };
                }}>{wordPack.value.enabledCardIds.join("\n")}</textarea
            >
        {/if}
        <h3>Szavak (1 szó / sor)</h3>
        <textarea
            class="words"
            placeholder="Szavak soronként"
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
                save((isSuccessful) => {
                    if (isSuccessful) {
                        alert("Sikeres mentés.");
                    } else {
                        alert("Hiba történt a mentés során.");
                    }
                });
            }}
        />
    </main>
</div>

<style>
    main {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        height: 100%;
    }

    textarea {
        resize: none;
    }

    .page {
        display: flex;
        flex-direction: column;
        height: 100dvh;
    }

    .title {
        font-size: 2rem;
    }

    .words {
        height: 100%;
    }
</style>
