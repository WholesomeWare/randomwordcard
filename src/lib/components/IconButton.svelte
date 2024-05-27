<script lang="ts">
    import { createEventDispatcher } from "svelte";


    import Icon from "./Icon.svelte";

    export let style: string = "";
    export let path: string;

    const dispatch = createEventDispatcher();

</script>

<button {style} on:click={() => dispatch("click")}>
    <Icon {path} />
</button>

<style>
    button {
        background: none;
        border: none;
        opacity: 0.5;
    }
</style>