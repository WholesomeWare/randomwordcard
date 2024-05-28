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
        gap: .5rem;
        padding: .5rem;
        border-radius: .5rem;
        background-color: #323232;
    }
</style>