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
    import WordPackDisplay from "$lib/components/WordPackDisplay.svelte";

    let card = $state(firestoreCard(null));
    let wordPacks: WordPack[] = $state([]);

    let isAddWordPackDialogOpen: boolean = $state(false);

    onMount(() => {
        card = firestoreCard($page.url.searchParams.get("cardId"));
        getWordPacks((newWordPacks) => (wordPacks = newWordPacks));
    });

    let activeWordPacks: WordPack[] = $derived(
        (card?.value?.activeWordPacks ?? [])
            .map((wordPackId) =>
                wordPacks.find((wordPack) => wordPack.id === wordPackId),
            )
            .filter((wordPack) => wordPack !== undefined)
            .map((wordPack) => wordPack as WordPack),
    );
</script>

<main>
    <Fab
        iconPath={mdiArrowLeft}
        text="Vissza"
        onclick={() =>
            (window.location = `../?cardId=${$page.url.searchParams.get("cardId")}`)}
    />
    <h2>Szó csomagok ({activeWordPacks.length ?? 0})</h2>
    <p>
        Ha egy csomagból több szót szeretnél egyszerre látni, akkor add hozzá a
        kártyához többször ugyanazt a csomagot.
    </p>
    {#each activeWordPacks as wordPack, index}
        <WordPackDisplay
            {wordPack}
            onAdd={() => {
                card.value = {
                    ...card.value,
                    activeWordPacks: [
                        ...card.value.activeWordPacks,
                        wordPack.id,
                    ],
                };
            }}
            onRemove={() => {
                card.value = {
                    ...card.value,
                    activeWordPacks: card.value.activeWordPacks.filter(
                        (wordPackId, i) => i !== index,
                    ),
                };
            }}
        />
    {/each}
    <Fab
        iconPath={mdiPlus}
        text="Szó csomag hozzáadása"
        onclick={() => (isAddWordPackDialogOpen = true)}
    />
</main>

<Dialog open={isAddWordPackDialogOpen}>
    <h3>Szó csomagok</h3>
    {#each wordPacks as wordPack}
        <WordPackDisplay
            {wordPack}
            onAdd={() => {
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
    {/each}
    <Fab
        iconPath={mdiClose}
        text="Mégsem"
        onclick={() => (isAddWordPackDialogOpen = false)}
    />
</Dialog>

<style>
    main {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        color: white;
    }
</style>
