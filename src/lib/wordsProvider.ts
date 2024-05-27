import type { FirestoreCard } from "./firebase/FirestoreCard.svelte";
import { getWordPacks } from "./firebase/wordPackProvider";

export function getWords(card: FirestoreCard, callback: (words: string[]) => void) {
    getWordPacks((wordPacks) => {
        const randomElements =
            card.value.activeWordPacks
                .map((wordPackId) => {
                    const wordPack = wordPacks.find((wordPack) => wordPack.id === wordPackId);
                    const words: string[] = wordPack?.words ?? [];

                    return { source: wordPack, word: words[Math.floor(Math.random() * words.length)] };
                })
                .filter((word) => word !== undefined) ?? [];

        if (randomElements.length === 0 || randomElements.join("").trim().length === 0) {
            callback([]);
            return;
        }

        const randomWords: string[] = randomElements.map((element) => {
            return {
                plaintext: element.word,
            }[element.source?.format ?? "plaintext"];
        })
            .filter((word) => word !== undefined)
            .map((word) => word as string);

        card.value = {
            ...card.value,
            history: [randomWords.join(", "), ...card.value.history],
        };
        callback(randomWords);
    });
}