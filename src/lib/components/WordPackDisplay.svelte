<script lang="ts">
    import type WordPack from "$lib/model/WordPack";
    import { mdiListBox, mdiClose, mdiPlus } from "@mdi/js";
    import Icon from "./Icon.svelte";
    import IconButton from "./IconButton.svelte";

    export let wordPack: WordPack;
    export let onAdd: (() => void) | null = null;
    export let onRemove: (() => void) | null = null;
</script>

<div class="wordPackDisplay">
    <div class="header">
        <Icon path={mdiListBox} />
        <p>{wordPack.name}</p>
        {#if onAdd}
            <IconButton path={mdiPlus} onclick={onAdd} />
        {/if}
        {#if onRemove}
            <IconButton path={mdiClose} onclick={onRemove} />
        {/if}
    </div>
    <p>
        {wordPack.description}
    </p>
</div>

<style>
    .wordPackDisplay {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        background-color: white;
        color: black;
        border-radius: 0.5rem;
    }

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }

    .header > p {
        width: 100%;
    }
</style>
