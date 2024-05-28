<script lang="ts">
    import Icon from "./Icon.svelte";

    export let style: string = "";
    export let containerColor: string = "#ffffff";
    export let contentColor: string = "#000000";
    export let iconPath: string;
    export let text: string = "";
    export let onclick: () => void;

</script>

<button style="background-color: {containerColor}; color: {contentColor}; {style}" onclick={onclick}>
    <Icon path={iconPath} color={contentColor} />
    {text}
</button>

<style>
    button {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: .5rem;
        padding: .5rem;
        border: none;
        border-radius: .5rem;
        color: white;
        cursor: pointer;
    }
</style>