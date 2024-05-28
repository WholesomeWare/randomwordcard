<script lang="ts">
    export let style = "";
    export let children;
    export let onclick: () => void = () => {};
</script>

<div {style} class="container" onclick={onclick} onkeypress={(e) => e.key === "Enter" && onclick()} tabindex="-1" role="button">
    {@render children()}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        border-radius: 1rem;
        background-color: #323232;
    }
</style>