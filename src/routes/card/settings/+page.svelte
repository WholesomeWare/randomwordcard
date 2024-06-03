<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import {
        getAllWordPacks,
        wordPackIsVisible,
    } from "$lib/firebase/wordPackProvider";
    import {
        mdiFlask,
        mdiHelp,
        mdiHelpCircle,
        mdiHelpCircleOutline,
        mdiHistory,
        mdiPlus,
    } from "@mdi/js";
    import WordPack, { WORDPACK_TAG_PUBLIC } from "$lib/model/WordPack";
    import { firestoreCard } from "$lib/firebase/FirestoreCard.svelte";
    import Fab from "$lib/components/Fab.svelte";
    import Panel from "$lib/components/Panel.svelte";
    import CardSlot from "$lib/model/CardSlot";
    import { getWords } from "$lib/wordsProvider";
    import Footer from "$lib/components/Footer.svelte";
    import CardSlotDisplay from "$lib/components/CardSlotDisplay.svelte";
    import TopAppBar from "$lib/components/TopAppBar.svelte";
    import WordPackDisplay from "$lib/components/WordPackDisplay.svelte";
    import {
        createWordPack,
        deleteWordPackById,
    } from "$lib/firebase/Firestore";

    let selectedTabIndex = $state(0);

    let card = $state(firestoreCard(null));
    let allWordPacks: WordPack[] = $state([]);
    let visibleWordPacks: WordPack[] = $derived(
        allWordPacks.filter((wordPack) =>
            wordPackIsVisible(wordPack, card.cardId),
        ),
    );

    let selectedBlockIndex: number = $state(-1);

    let testWords: string[] = $state([]);

    $effect(() => {
        card.doAutoUpdate = selectedBlockIndex === -1;
        if (card.doAutoUpdate) card.updateDatabase();
    });

    onMount(() => {
        const cardId = $page.url.searchParams.get("cardId");
        card = firestoreCard(cardId);
        getAllWordPacks((newWordPacks) => (allWordPacks = newWordPacks));
    });
</script>

<TopAppBar
    title="Beállítások"
    tabs={["Kártya", "Szótár", "Játékok"]}
    {selectedTabIndex}
    onback={() => {
        card.updateDatabase();
        window.location = `../?cardId=${$page.url.searchParams.get("cardId")}`;
    }}
    ontabchange={(index) => {
        selectedTabIndex = index;
    }}
/>

<main>
    {#if selectedTabIndex === 0}
        <h2>Blokkok</h2>
        <p>
            Egy blokk az egy hely a kártyán. Ha több szót szeretnél látni
            egyszerre, adj több blokkot a kártyádhoz.
        </p>
        {#each card.value.slotsJSON as slotJSON, blockIndex}
            <CardSlotDisplay
                {card}
                cardSlot={CardSlot.fromJSON(slotJSON)}
                wordPacks={visibleWordPacks}
                {blockIndex}
                isSelected={blockIndex === selectedBlockIndex}
                onSelectRequest={(blockIndex) =>
                    (selectedBlockIndex = blockIndex)}
            />
        {/each}
        <Fab
            iconPath={mdiPlus}
            text="Új blokk"
            onclick={() => {
                card.value = {
                    ...card.value,
                    slotsJSON: [
                        ...card.value.slotsJSON,
                        CardSlot.plaintext("").toJSON(),
                    ],
                };
                selectedBlockIndex = card.value.slotsJSON.length - 1;
            }}
        />
        <Fab
            iconPath={mdiFlask}
            text="Teszt"
            onclick={() => {
                getWords(card, (words) => {
                    alert(
                        "A jelenlegi beállításokkal ilyen kártya jelenhet meg:\n- " +
                            words.join("\n- "),
                    );
                });
            }}
        />
        <h2>Beállítások</h2>
        <Fab
            iconPath={mdiHistory}
            text="Előzmények mentése: {card.value.isSavingHistory
                ? 'Bekapcsolva'
                : 'Kikapcsolva'}"
            onclick={() => {
                card.value = {
                    ...card.value,
                    isSavingHistory: !card.value.isSavingHistory,
                };
            }}
        />
        <Panel>
            <p style="font-family: 'Courier New', Courier, monospace;">
                {card.value.hardcodedMessage}
            </p>
        </Panel>
        <p style="color: #888;">
            ID: {card.cardId}
        </p>
    {:else if selectedTabIndex === 1}
        <h2>Saját szó csomagok</h2>
        {#each allWordPacks as wordPack}
            {#if wordPack.ownerCardId === card.cardId}
                <WordPackDisplay
                    currentCardId={card.cardId}
                    {wordPack}
                    onRemove={() => {
                        if (
                            confirm(
                                "Biztosan törölni szeretnéd ezt a szócsomagot?",
                            )
                        ) {
                            deleteWordPackById(wordPack.id)
                                .then(() => {
                                    getAllWordPacks(
                                        (newWordPacks) =>
                                            (allWordPacks = newWordPacks),
                                    );
                                })
                                .catch((error) => {
                                    alert("Sikertelen törlés!");
                                });
                        }
                    }}
                />
            {/if}
        {/each}
        <Fab
            iconPath={mdiPlus}
            text="Új szócsomag"
            onclick={() => {
                createWordPack({
                    ...new WordPack(),
                    ownerCardId: card.cardId,
                })
                    .then((ref) => {
                        window.location = `/wordpack/?cardId=${card.cardId}&wordPackId=${ref.id}`;
                    })
                    .catch((error) => {
                        alert("Sikertelen létrehozás!");
                    });
            }}
        />
        <h2>Kölcsön kapott csomagok</h2>
        {#each allWordPacks as wordPack}
            {#if wordPack.enabledCardIds.includes(card.cardId)}
                <WordPackDisplay
                    currentCardId={card.cardId}
                    {wordPack}
                />
            {/if}
        {/each}
        <Fab
            iconPath={mdiHelpCircleOutline}
            text="Hogyan kaphatok mástól szavakat?"
            onclick={() => {
                alert(
                    `A kártyád azonosítóját kell megadnod a másik félnek: "${card.cardId}" Ezt a "Kártya" lap alján is megtalálod. Ezt kell a másik félnek a "Kölcsönző kártyák azonosítója soronként" mezőbe beírnia a szócsomag szerkesztésekor.`,
                );
            }}
        />
        <h2>Beépített szó csomagok</h2>
        {#each allWordPacks as wordPack}
            {#if wordPack.tags.includes(WORDPACK_TAG_PUBLIC)}
                <WordPackDisplay {wordPack} />
            {/if}
        {/each}
    {:else if selectedTabIndex === 2}
        <p>Hogyan kell játszani ezzel a kártyával? Itt van pár ötlet!</p>
        <h2>Ne is mondd...</h2>
        <p>
            Egy ember kap egy szót. Arról kell panaszkodnia / ideges kirohanás
            szerűen beszélnie X ideig.
        </p>
        <h2>Gondoljatok bele!</h2>
        <p>
            Egy ember kap egy szót. Arról kell kitalálni egy összeesküvés
            elméletet. Minél őrültebb, annál jobb! Az elmélet magyarázását a
            "gondoljatok bele" szavakkal kell zárni és az nyer, aki komoly
            arccal tudja végigmondani a elméletét.
        </p>
        <h2>Illuminati</h2>
        <p>
            Hasonló, mint a "Gondoljatok bele!" csak itt 2 szót kap egy ember.
            Azt a kettő szót kell összekötni egy összeesküvés elmélettel.
        </p>
        <h2>A világ legnagyobb szakértője</h2>
        <p>
            Egy ember kap egy szót. Arról kell beszélnie, mintha ő lenne a világ
            legnagyobb szakértője ebben a témában. A többi játékosnak szabad
            bármit kérdeznie a szakértőtől és a szakértőnek válaszolnia kell.
        </p>
        <h2>Asszociáció</h2>
        <p>
            Az első játékos kap egy szót. Azonnal mondania kell egy másik szót,
            ami arról eszébe jutott. A következő játékosnak az előző szavára
            kell mondania valamit, ami eszébe jutott és így tovább.
        </p>
        <h2>Vers író kihívás</h2>
        <p>
            Ajánlott a kártyát több random szóra állítani. Minél több a szó,
            annál nehezebb a játék. Minden játékos megkapja az X darab random
            szavát és írnia kell egy verset, amiben mindegyik benne van. Ezt
            lehet időkorláttal is játszani vagy egyéb műfajokkal.
        </p>
        <h2>Találj ki saját szabályokat!</h2>
        <p>
            Van néhány beépített szó csomag, amelyek direkt konkrét játékokhoz
            készültek, de nincsenek hozzájuk szabályok. Például az "Itass vagy
            igyál" szócsomag. Ezekhez találj ki saját szabályokat és játszatok
            aszerint!
        </p>
    {/if}
</main>

<Footer />

<style>
    main {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        color: white;
    }

    h2 {
        padding-top: 2rem;
    }
</style>
