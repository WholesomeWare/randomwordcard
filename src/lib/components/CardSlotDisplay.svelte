<script lang="ts">
    import CardSlot from "$lib/model/CardSlot";
    import {
        mdiCheck,
        mdiPencil,
        mdiContentCopy,
        mdiClose,
        mdiPlus,
    } from "@mdi/js";
    import Fab from "./Fab.svelte";
    import IconButton from "./IconButton.svelte";
    import Panel from "./Panel.svelte";
    import WordPackDisplay from "./WordPackDisplay.svelte";
    import type { FirestoreCard } from "$lib/firebase/FirestoreCard.svelte";
    import type WordPack from "$lib/model/WordPack";
    import Dialog from "./Dialog.svelte";

    let {
        card,
        cardSlot,
        wordPacks,
        blockIndex = -1,
        isSelected = false,
        onSelectRequest = () => {},
    }: {
        card: FirestoreCard;
        cardSlot: CardSlot;
        wordPacks: WordPack[];
        blockIndex: number;
        isSelected: boolean;
        onSelectRequest: (blockIndex: number) => void;
    } = $props();

    let isAddWordPackDialogOpen: boolean = $state(false);

</script>

<Panel>
    <div
        style="display: flex; flex-direction: row; align-items: center; gap: 1rem;"
    >
        {#if isSelected}
            <select
                style="width: 100%;"
                value={cardSlot.format}
                onchange={(e) => {
                    card.value = {
                        ...card.value,
                        slotsJSON: card.value.slotsJSON.map((slot, i) => {
                            if (i === blockIndex) {
                                switch (e.target?.value) {
                                    case "plaintext":
                                        return CardSlot.plaintext("").toJSON();
                                    case "wordPacks":
                                        return CardSlot.wordPacks([]).toJSON();
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
        {:else}
            <p style="width: 100%; font-size: .8rem;">
                {#if cardSlot.format === "plaintext"}
                    {cardSlot.value}
                {:else if cardSlot.format === "wordPacks"}
                    {#each cardSlot.value.split(",") as wordPackId}
                        📦{wordPacks.find((wp) => wp.id === wordPackId)?.name}
                    {/each}
                {/if}
            </p>
        {/if}
        <IconButton
            path={isSelected ? mdiCheck : mdiPencil}
            color="white"
            onclick={() => onSelectRequest(isSelected ? -1 : blockIndex)}
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
    {#if isSelected}
        {#if cardSlot.format === "plaintext"}
            <input
                type="text"
                value={cardSlot.value}
                oninput={(e) => {
                    card.value = {
                        ...card.value,
                        slotsJSON: card.value.slotsJSON.map((slot, i) => {
                            if (i === blockIndex) {
                                return CardSlot.plaintext(
                                    e.target?.value,
                                ).toJSON();
                            }
                            return slot;
                        }),
                    };
                }}
            />
        {:else if cardSlot.format === "wordPacks"}
            {#each cardSlot.value.split(",") as wordPackId, wordPackIndex}
                {#if wordPacks.find((wp) => wp.id === wordPackId)}
                    <WordPackDisplay
                        wordPack={wordPacks.find((wp) => wp.id === wordPackId)}
                        currentCardId={card.cardId}
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
                                                            j !== wordPackIndex,
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
                    isAddWordPackDialogOpen = true;
                }}
            />
        {/if}
    {/if}
</Panel>

<Dialog open={isAddWordPackDialogOpen}>
    <h3>Szó csomagok</h3>
    {#each wordPacks as wordPack}
        <WordPackDisplay
            {wordPack}
            currentCardId={card.cardId}
            onAdd={() => {
                card.value = {
                    ...card.value,
                    slotsJSON: card.value.slotsJSON.map((slot, i) => {
                        if (i === blockIndex) {
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
