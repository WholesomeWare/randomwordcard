import { collection, getDocs } from "firebase/firestore";
import { initializeFirebase } from "./firebase";
import WordPack from "$lib/model/WordPack";
import { browser } from "$app/environment";

export function getWordPacks(callback: (wordPacks: WordPack[]) => void) {
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