import { collection, getDocs } from "firebase/firestore";
import { initializeFirebase } from "./firebase";
import WordPack from "$lib/model/WordPack";
import { browser } from "$app/environment";

function isVisibleToUser(wordPack: WordPack, cardId: string | null) {
    return wordPack.tags.includes("public") ||
        wordPack.ownerCardId === cardId;
}

export function getWordPacks(currentCardId: string | null, callback: (wordPacks: WordPack[]) => void) {
    if (!browser) return;

    const { firestore } = initializeFirebase();

    getDocs(collection(firestore, "wordPacks"))
        .then((querySnapshot) => {
            const wordPacks = querySnapshot.docs.map((doc) => {
                return { ...new WordPack(), ...doc.data(), id: doc.id };
            });
            callback(wordPacks.filter((wordPack) => isVisibleToUser(wordPack, currentCardId)));
        })
        .catch((error) => {
            console.error("Error getting word packs: ", error);
            callback([]);
        });
}