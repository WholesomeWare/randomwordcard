<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { getWordPacks } from "$lib/firebase/wordPackProvider";
    import {
        mdiArrowLeft,
        mdiCheck,
        mdiClose,
        mdiContentCopy,
        mdiPencil,
        mdiPlus,
    } from "@mdi/js";
    import WordPack from "$lib/model/WordPack";
    import {
        firestoreCard,
        type FirestoreCard,
    } from "$lib/firebase/FirestoreCard.svelte";
    import Fab from "$lib/components/Fab.svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import IconButton from "$lib/components/IconButton.svelte";
    import WordPackDisplay from "$lib/components/WordPackDisplay.svelte";
    import Panel from "$lib/components/Panel.svelte";
    import CardSlot from "$lib/model/CardSlot";
    import { getWords } from "$lib/wordsProvider";

    let card = $state(firestoreCard(null));
    let wordPacks: WordPack[] = $state([]);

    let selectedBlockIndex: number = $state(-1);
    let isAddWordPackDialogOpen: boolean = $state(false);

    let testWords: string[] = $state([]);

    $effect(() => {
        card.value;
        getWords(card, (words) => testWords = words);
    })

    onMount(() => {
        card = firestoreCard($page.url.searchParams.get("cardId"));
        getWordPacks((newWordPacks) => (wordPacks = newWordPacks));
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
        adj több blokkot a kártyádhoz.
    </p>
    {#each card.value.slotsJSON as slotJSON, blockIndex}
        <Panel>
            <div
                style="display: flex; flex-direction: row; align-items: center; gap: 1rem;"
            >
                <p style="width: 100%; font-weight: bold;">Blokk #{blockIndex}</p>
                <IconButton
                    path={blockIndex === selectedBlockIndex
                        ? mdiCheck
                        : mdiPencil}
                    color="white"
                    onclick={() =>
                        (selectedBlockIndex =
                            blockIndex === selectedBlockIndex
                                ? -1
                                : blockIndex)}
                />
                <IconButton
                    path={mdiContentCopy}
                    color="white"
                    onclick={() => {
                        card.value = {
                            ...card.value,
                            slotsJSON: [
                                ...card.value.slotsJSON,
                                card.value.slotsJSON[blockIndex],
                            ],
                        };
                    }}
                />
                <IconButton
                    path={mdiClose}
                    color="white"
                    onclick={() => {
                        card.value = {
                            ...card.value,
                            slotsJSON: card.value.slotsJSON.filter(
                                (_, i) => i !== blockIndex,
                            ),
                        };
                    }}
                />
            </div>
            {#if selectedBlockIndex !== blockIndex}
                <p style="font-size: .8rem; opacity: .7;">
                    {#if CardSlot.fromJSON(slotJSON).format === "plaintext"}
                        {CardSlot.fromJSON(slotJSON).value}
                    {:else if CardSlot.fromJSON(slotJSON).format === "wordPacks"}
                        {#each CardSlot.fromJSON(slotJSON).value.split(",") as wordPackId}
                            📦{wordPacks.find((wp) => wp.id === wordPackId)?.name}
                        {/each}
                    {/if}
                </p>
            {:else}
                <select
                    value={CardSlot.fromJSON(slotJSON).format}
                    onchange={(e) => {
                        card.value = {
                            ...card.value,
                            slotsJSON: card.value.slotsJSON.map((slot, i) => {
                                if (i === blockIndex) {
                                    switch (e.target?.value) {
                                        case "plaintext":
                                            return CardSlot.plaintext(
                                                "",
                                            ).toJSON();
                                        case "wordPacks":
                                            return CardSlot.wordPacks(
                                                [],
                                            ).toJSON();
                                    }
                                }
                                return slot;
                            }),
                        };
                    }}
                >
                    <option value="plaintext">Egyszerű szöveg</option>
                    <option value="wordPacks">Szó csomagok</option>
                </select>
                {#if CardSlot.fromJSON(slotJSON).format === "plaintext"}
                    <input
                        type="text"
                        value={CardSlot.fromJSON(slotJSON).value}
                        oninput={(e) => {
                            card.value = {
                                ...card.value,
                                slotsJSON: card.value.slotsJSON.map(
                                    (slot, i) => {
                                        if (i === blockIndex) {
                                            return CardSlot.plaintext(
                                                e.target?.value,
                                            ).toJSON();
                                        }
                                        return slot;
                                    },
                                ),
                            };
                        }}
                    />
                {:else if CardSlot.fromJSON(slotJSON).format === "wordPacks"}
                    {#each CardSlot.fromJSON(slotJSON).value.split(",") as wordPackId, wordPackIndex}
                        {#if wordPacks.find((wp) => wp.id === wordPackId)}
                            <WordPackDisplay
                                wordPack={wordPacks.find(
                                    (wp) => wp.id === wordPackId,
                                )}
                                onRemove={() => {
                                    card.value = {
                                        ...card.value,
                                        slotsJSON: card.value.slotsJSON.map(
                                            (slot, i) => {
                                                if (i === blockIndex) {
                                                    return CardSlot.wordPacks(
                                                        CardSlot.fromJSON(slot)
                                                            .value.split(",")
                                                            .filter(
                                                                (_, j) =>
                                                                    j !==
                                                                    wordPackIndex,
                                                            ),
                                                    ).toJSON();
                                                }
                                                return slot;
                                            },
                                        ),
                                    };
                                }}
                            />
                        {/if}
                    {/each}
                    <Fab
                        iconPath={mdiPlus}
                        text="Szó csomag hozzáadása"
                        onclick={() => {
                            selectedBlockIndex = blockIndex;
                            isAddWordPackDialogOpen = true;
                        }}
                    />
                {/if}
            {/if}
        </Panel>
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
    <p>
        A jelenlegi beállításokkal ilyen kártya jelenhet meg:
    </p>
    <ul>
        {#each testWords as word}
            <li>{word}</li>
        {/each}
    </ul>
</main>

<Dialog open={isAddWordPackDialogOpen}>
    <h3>Szó csomagok</h3>
    {#each wordPacks as wordPack}
        <WordPackDisplay
            {wordPack}
            onAdd={() => {
                card.value = {
                    ...card.value,
                    slotsJSON: card.value.slotsJSON.map((slot, i) => {
                        if (i === selectedBlockIndex) {
                            return CardSlot.wordPacks([
                                ...CardSlot.fromJSON(slot).value.split(","),
                                wordPack.id,
                            ]).toJSON();
                        }
                        return slot;
                    }),
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
