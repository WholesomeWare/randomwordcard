<script>
    import { firestoreCard } from "$lib/firebase/FirestoreCard.svelte";

    const testCardId = "SRUqOSs1pDFmdQCmUCMP";

    let card = firestoreCard(testCardId);
</script>

<p>
    {JSON.stringify(card.value)}
</p>

<button
    onclick={() => {
        card.value = {
            ...card.value,
            activeWordPacks: [...card.value.activeWordPacks, "test"],
        };
    }}
>
    Add test word pack
</button>
