import { collection, getDocs } from "firebase/firestore";
import { initializeFirebase } from "./firebase";
import WordPack from "$lib/model/WordPack";
import { browser } from "$app/environment";

export function wordPackIsVisible(wordPack: WordPack, cardId: string | null) {
    return wordPack.tags.includes("public") ||
        wordPack.ownerCardId === cardId ||
        (cardId && wordPack.enabledCardIds.includes(cardId));
}

export function getAllWordPacks(callback: (wordPacks: WordPack[]) => void) {
    if (!browser) return;

    const { firestore } = initializeFirebase();

    getDocs(collection(firestore, "wordPacks"))
        .then((querySnapshot) => {
            const wordPacks = querySnapshot.docs.map((doc) => {
                return { ...new WordPack(), ...doc.data(), id: doc.id };
            });
            callback(wordPacks);
        })
        .catch((error) => {
            console.error("Error getting word packs: ", error);
            callback([]);
        });
}

export function getVisibleWordPacks(currentCardId: string | null, callback: (wordPacks: WordPack[]) => void) {
    getAllWordPacks((wordPacks) => {
        callback(wordPacks.filter((wordPack) => wordPackIsVisible(wordPack, currentCardId)));
    });
}