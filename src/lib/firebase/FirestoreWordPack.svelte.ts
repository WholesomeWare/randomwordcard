import { browser } from "$app/environment";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { initializeFirebase } from "./firebase";
import type { Unsubscribe } from "firebase/app-check";
import { onDestroy } from "svelte";
import WordPack from "$lib/model/WordPack";

export class FirestoreWordPack {
    #firestore = initializeFirebase().firestore;
    isReady = false;
    #firestoreListener: Unsubscribe | null = null;
    value: WordPack = $state<WordPack>(new WordPack());
    wordPackId: string;
    doAutoUpdate: boolean = true;

    constructor(wordPackId: string | null) {
        this.wordPackId = wordPackId ?? "";

        if (!wordPackId) return;

        if (browser) {
            getDoc(doc(this.#firestore, "wordPacks", wordPackId))
                .then((doc) => {
                    if (doc.exists()) {
                        this.value = { ...new WordPack(), ...doc.data(), id: doc.id };
                    }
                    this.isReady = true;
                })
                .catch((error) => {
                    console.error("Error getting document:", error);
                    console.log("Word pack loaded:", this.value);
                });

            this.#firestoreListener = onSnapshot(doc(this.#firestore, "cards", wordPackId), (doc) => {
                if (doc.exists()) {
                    this.value = { ...new WordPack(), ...doc.data(), id: doc.id };
                }
            });
        }

        $effect(() => {
            this.value;
            if (this.isReady && this.doAutoUpdate) {
                this.updateDatabase();
            }
        });

        onDestroy(() => {
            this.#firestoreListener?.();
        });
    }

    updateDatabase(onSaved: (isSuccessful: boolean) => void = () => {}) {
        if (this.isReady) {
            setDoc(doc(this.#firestore, "wordPacks", this.wordPackId), this.value)
                .then(() => {
                    onSaved(true);
                })
                .catch((error) => {
                    console.error("Error updating document:", error);
                    onSaved(false);
                });
        }
    }
}

export function firestoreWordPack(wordPackId: string | null): FirestoreWordPack {
    return new FirestoreWordPack(wordPackId);
}
