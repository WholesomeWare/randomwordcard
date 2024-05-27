<script lang="ts">
    import type WordPack from "$lib/model/WordPack";
    import { mdiListBox, mdiClose, mdiPlus, mdiMenu, mdiDotsVertical } from "@mdi/js";
    import Icon from "./Icon.svelte";
    import IconButton from "./IconButton.svelte";
    import Dialog from "./Dialog.svelte";
    import Fab from "./Fab.svelte";

    let {
        wordPack,
        onAdd,
        onRemove,
    }: {
        wordPack: WordPack;
        onAdd: (() => void) | null;
        onRemove: (() => void) | null;
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
        <IconButton path={mdiClose} color="white" onclick={() => (isMenuOpen = false)} />
    </div>
    <p>{wordPack.description}</p>
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
