<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { getWordPacks } from "$lib/firebase/wordPackProvider";
    import {
        mdiArrowLeft,
        mdiClose,
        mdiCog,
        mdiListBox,
        mdiPlus,
        mdiRefresh,
    } from "@mdi/js";
    import WordPack from "$lib/model/WordPack";
    import {
        firestoreCard,
        type FirestoreCard,
    } from "$lib/firebase/FirestoreCard.svelte";
    import Fab from "$lib/components/Fab.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import IconButton from "$lib/components/IconButton.svelte";

    let cardId: string | null = $state(null);
    let card: FirestoreCard | null = $state(null);
    let wordPacks: WordPack[] = $state([]);

    let isAddWordPackDialogOpen: boolean = $state(false);

    onMount(() => {
        cardId = $page.url.searchParams.get("cardId");
        if (!cardId) {
            throw new Error("cardId is required");
        }
        card = firestoreCard(cardId);
        if (!card) {
            throw new Error("card not found");
        }
        getWordPacks((newWordPacks) => (wordPacks = newWordPacks));
    });

    let activeWordPacks = $derived(
        (card?.value?.activeWordPacks ?? []).map((wordPackId) =>
            wordPacks.find((wordPack) => wordPack.id === wordPackId),
        ),
    );
</script>

<main>
    <Fab
        iconPath={mdiArrowLeft}
        text="Vissza"
        on:click={() => (window.location = `../?cardId=${cardId}`)}
    />
    <h2>Szó csomagok ({card?.value?.activeWordPacks?.length ?? 0})</h2>
    {#each activeWordPacks as wordPack}
        <div class="wordPackDisplay">
            <Icon path={mdiListBox} />
            <p>{wordPack.name} ({wordPack.words.length})</p>
            <IconButton
                path={mdiClose}
                on:click={() =>
                    (card.value = {
                        ...card.value,
                        activeWordPacks: card.value.activeWordPacks.filter(
                            (id) => id !== wordPack.id,
                        ),
                    })}
            />
        </div>
    {/each}
    <Fab
        iconPath={mdiPlus}
        text="Szó csomag hozzáadása"
        on:click={() => (isAddWordPackDialogOpen = true)}
    />
</main>

<Dialog open={isAddWordPackDialogOpen}>
    {#each wordPacks as wordPack}
        <div class="wordPackDisplay">
            <Icon path={mdiListBox} />
            <p>{wordPack.name} ({wordPack.words.length})</p>
            <IconButton
                path={mdiPlus}
                on:click={() => {
                    card.value = {
                        ...card.value,
                        activeWordPacks: [
                            ...card.value.activeWordPacks,
                            wordPack.id,
                        ],
                    };
                    isAddWordPackDialogOpen = false;
                }}
            />
        </div>
    {/each}
</Dialog>

<style>
    main {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        color: white;
    }

    .wordPackDisplay {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
        background-color: white;
        border-radius: 0.5rem;
    }

    .wordPackDisplay * {
        color: black;
    }
</style>
