<script lang="ts">
    import type WordPack from "$lib/model/WordPack";
    import {
        mdiListBox,
        mdiClose,
        mdiPlus,
        mdiMenu,
        mdiDotsVertical,
        mdiPencil,
    } from "@mdi/js";
    import Icon from "./Icon.svelte";
    import IconButton from "./IconButton.svelte";
    import Dialog from "./Dialog.svelte";
    import Fab from "./Fab.svelte";

    let {
        wordPack,
        currentCardId = "",
        onAdd = undefined,
        onRemove = undefined,
    }: {
        wordPack: WordPack;
        currentCardId: string;
        onAdd: (() => void) | undefined;
        onRemove: (() => void) | undefined;
    } = $props();

    let isMenuOpen = $state(false);
</script>

<div class="wordPackDisplay">
    <Icon path={mdiListBox} />
    <p>{wordPack.name}</p>
    {#if onAdd}
        <IconButton path={mdiPlus} onclick={onAdd} />
    {/if}
    <IconButton path={mdiDotsVertical} onclick={() => (isMenuOpen = true)} />
</div>

<Dialog open={isMenuOpen}>
    <div
        style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;"
    >
        <h3>{wordPack.name} ({wordPack.words.length})</h3>
        <IconButton
            path={mdiClose}
            color="white"
            onclick={() => (isMenuOpen = false)}
        />
    </div>
    <p>{wordPack.description}</p>
    {#if currentCardId === wordPack.ownerCardId}
        <Fab
            iconPath={mdiPencil}
            text="Szerkesztés"
            onclick={() => {
                window.location = `/wordpack/?cardId=${currentCardId}&wordPackId=${wordPack.id}`;
            }}
        />
    {/if}
    {#if onRemove}
        <Fab
            iconPath={mdiClose}
            text="Törlés"
            onclick={() => {
                onRemove();
                isMenuOpen = false;
            }}
        />
    {/if}
    <h4>Szavak</h4>
    <ul>
        {#each wordPack.words as word}
            <li>{word}</li>
        {/each}
    </ul>
</Dialog>

<style>
    .wordPackDisplay {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: white;
        color: black;
        border-radius: 0.5rem;
    }

    .wordPackDisplay > p {
        width: 100%;
    }
</style>
