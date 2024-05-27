<script lang="ts">
    import Icon from "./Icon.svelte";

    export let style: string = "";
    export let path: string;
    export let onclick: () => void;

</script>

<button {style} onclick={onclick}>
    <Icon {path} />
</button>

<style>
    button {
        background: none;
        border: none;
        opacity: 0.5;
    }
</style>