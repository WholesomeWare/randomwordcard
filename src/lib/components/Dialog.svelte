<script>
    export let open = false;
    export let children;
</script>

{#if open}
<div>
    <dialog {open}>
        {@render children()}
    </dialog>
</div>
{/if}

<style>
    div {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100dvh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.8);
    }

    dialog {
        position: relative;
        background-color: #282828;
        padding: 1rem;
        width: calc(100vw - 3rem);
        color: #ffffff;
        border: none;
        border-radius: 1rem;
    }
</style>