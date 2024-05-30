<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { getWordPacks } from "$lib/firebase/wordPackProvider";
    import { mdiArrowLeft, mdiHistory, mdiPlus } from "@mdi/js";
    import WordPack from "$lib/model/WordPack";
    import { firestoreCard } from "$lib/firebase/FirestoreCard.svelte";
    import Fab from "$lib/components/Fab.svelte";
    import Panel from "$lib/components/Panel.svelte";
    import CardSlot from "$lib/model/CardSlot";
    import { getWords } from "$lib/wordsProvider";
    import Footer from "$lib/components/Footer.svelte";
    import CardSlotDisplay from "$lib/components/CardSlotDisplay.svelte";

    let card = $state(firestoreCard(null));
    let wordPacks: WordPack[] = $state([]);

    let selectedBlockIndex: number = $state(-1);

    let testWords: string[] = $state([]);

    $effect(() => {
        card.value.slotsJSON;
        getWords(card, (words) => (testWords = words));
    });

    $effect(() => {
        card.doAutoUpdate = selectedBlockIndex === -1;
        if (card.doAutoUpdate) card.updateDatabase();
    });

    onMount(() => {
        const cardId = $page.url.searchParams.get("cardId");
        card = firestoreCard(cardId);
        getWordPacks(cardId, (newWordPacks) => (wordPacks = newWordPacks));
    });
</script>

<main>
    <Fab
        iconPath={mdiArrowLeft}
        text="Vissza"
        onclick={() =>
            (window.location = `../?cardId=${$page.url.searchParams.get("cardId")}`)}
    />
    <h2>Blokkok</h2>
    <p>
        Egy blokk az egy hely a kártyán. Ha több szót szeretnél látni egyszerre,
        adj több blokkot a kártyádhoz. Ne felejts a pipára nyomni a mentéshez!
    </p>
    {#each card.value.slotsJSON as slotJSON, blockIndex}
        <CardSlotDisplay
            {card}
            cardSlot={CardSlot.fromJSON(slotJSON)}
            {wordPacks}
            {blockIndex}
            isSelected={blockIndex === selectedBlockIndex}
            onSelectRequest={(blockIndex) => (selectedBlockIndex = blockIndex)}
        />
    {/each}
    <Fab
        iconPath={mdiPlus}
        text="Új blokk"
        onclick={() => {
            card.value = {
                ...card.value,
                slotsJSON: [
                    ...card.value.slotsJSON,
                    CardSlot.plaintext("").toJSON(),
                ],
            };
            selectedBlockIndex = card.value.slotsJSON.length - 1;
        }}
    />
    <h2>Teszt</h2>
    <p>A jelenlegi beállításokkal ilyen kártya jelenhet meg:</p>
    <ul>
        {#each testWords as word}
            <li>{word}</li>
        {/each}
    </ul>
    <h2>Beállítások</h2>
    <Fab
        iconPath={mdiHistory}
        text="Előzmények mentése: {card.value.isSavingHistory
            ? 'Bekapcsolva'
            : 'Kikapcsolva'}"
        onclick={() => {
            card.value = {
                ...card.value,
                isSavingHistory: !card.value.isSavingHistory,
            };
        }}
    />
    <Panel>
        <p style="font-family: 'Courier New', Courier, monospace;">
            {card.value.hardcodedMessage}
        </p>
    </Panel>
    <p style="color: #888;">
        ID: {card.cardId}
    </p>
</main>

<Footer />

<style>
    main {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        color: white;
    }

    h2 {
        padding-top: 2rem;
    }
</style>
