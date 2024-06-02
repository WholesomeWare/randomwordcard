<script lang="ts">
    import { mdiArrowLeft } from "@mdi/js";
    import IconButton from "./IconButton.svelte";

    let {
        title,
        tabs = [],
        selectedTabIndex = 0,
        onback = undefined,
        ontabchange = (index: number) => {},
    }: {
        title: string;
        tabs: string[];
        selectedTabIndex: number;
        onback: (() => void) | undefined;
        ontabchange: (index: number) => void;
    } = $props();
</script>

<header>
    <div class="title">
        {#if onback}
            <IconButton
                path={mdiArrowLeft}
                onclick={() => {
                    onback?.();
                }}
                color="white"
            />
        {/if}
        <h3>Beállítások</h3>
    </div>
    <div class="tabs">
        {#each tabs as tab, index}
            <button
                onclick={() => ontabchange(index)}
                class:selected={selectedTabIndex === index}
            >
                {tab}
            </button>
        {/each}
    </div>
</header>

<style>
    header {
        background-color: #f7665f;
    }

    header > .title {
        display: flex;
        flex-direction: row;
        padding: 1rem;
        gap: 1rem;
        align-items: center;
    }

    header > .tabs {
        display: flex;
        flex-direction: row;
    }

    .tabs > button {
        background-color: transparent;
        border: none;
        color: white;
        padding: 1rem;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
    }

    .tabs > button.selected {
        border-bottom: 2px solid white;
    }
</style>
