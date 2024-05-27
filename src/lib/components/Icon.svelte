<script lang="ts">
    import { scale } from "svelte/transition";

    export let style: string = "";
    export let path: string;
    export let size: number = 24;
    export let color: string = "black";
</script>

<div {style}>
    <svg style="width: {size}px;">
        <path d={path} fill={color} style="scale: calc(1 / 24 * {size})" />
    </svg>
</div>

<style>
    div {
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }

    svg {
        aspect-ratio: 1 / 1;
    }
</style>