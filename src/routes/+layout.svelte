<slot />

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
    }

    :global(body) {
        background-color: #282828;
        color: white;
    }

    :global(p) {
        font-size: .95rem;
    }

    :global(li) {
        margin-left: 1rem;
    }

    :global(input[type="text"], select) {
        padding: 0.5rem;
        border: none;
        border-radius: 0.5rem;
    }
</style>