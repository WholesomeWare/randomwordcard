<script lang="ts">
    import Icon from "./Icon.svelte";

    export let style: string = "";
    export let path: string;
    export let color: string = "black";
    export let size: number = 24;
    export let onclick: () => void;

</script>

<button {style} onclick={onclick}>
    <Icon {path} {color} {size} />
</button>

<style>
    button {
        background: none;
        border: none;
        cursor: pointer;
    }
</style>