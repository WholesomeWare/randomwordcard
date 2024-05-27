<script lang="ts">
    export let style: string = "";
    export let path: string;
    export let color: string = "black";
</script>

<svg {style}>
    <path d={path} fill={color} />
</svg>

<style>
    svg {
        width: 24px;
        height: 24px;
    }
</style>