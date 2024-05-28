import type { FirestoreCard } from "./firebase/FirestoreCard.svelte";
import { getWordPacks } from "./firebase/wordPackProvider";
import CardSlot from "./model/CardSlot";
import type WordPack from "./model/WordPack";

export function getWords(card: FirestoreCard, callback: (slots: string[]) => void) {
    getWordPacks(card.cardId, (wordPacks) => {
        const slots: string[] = card.value.slotsJSON.map((slotJSON) => {
            const slot = CardSlot.fromJSON(slotJSON);

            switch (slot.format) {
                case "plaintext":
                    return slot.value;
                case "wordPacks": {
                    const packs = slot.value.split(",")
                        .map((id) => wordPacks.find((pack) => pack.id === id))
                        .filter((pack) => pack !== undefined)
                        .map((pack) => pack as WordPack);
                    const words = packs.flatMap((pack) => pack.words);
                    return words[Math.floor(Math.random() * words.length)];
                }
                default:
                    return "";
            }
        });

        callback(slots);
    });
}