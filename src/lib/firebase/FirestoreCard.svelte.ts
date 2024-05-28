import { browser } from "$app/environment";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { initializeFirebase } from "./firebase";
import Card from "$lib/model/Card";
import type { Unsubscribe } from "firebase/app-check";
import { onDestroy } from "svelte";

export class FirestoreCard {
    #firestore = initializeFirebase().firestore;
    #isReady = false;
    #firestoreListener: Unsubscribe | null = null;
    value: Card = $state<Card>(new Card());
    cardId: string;
    doAutoUpdate: boolean = true;

    constructor(cardId: string | null) {
        this.cardId = cardId ?? "";

        if (!cardId) return;

        if (browser) {
            getDoc(doc(this.#firestore, "cards", cardId))
                .then((doc) => {
                    if (doc.exists()) {
                        this.value = { ...new Card(), ...doc.data(), id: doc.id };
                    }
                    this.#isReady = true;
                })
                .catch((error) => {
                    console.error("Error getting document:", error);
                    this.#isReady = true;
                    console.log("Card loaded:", this.value);
                });

            this.#firestoreListener = onSnapshot(doc(this.#firestore, "cards", cardId), (doc) => {
                if (doc.exists()) {
                    this.value = { ...new Card(), ...doc.data(), id: doc.id };
                }
            });
        }

        $effect(() => {
            this.value;
            if (this.#isReady && this.doAutoUpdate) {
                this.updateDatabase();
            }
        });

        onDestroy(() => {
            this.#firestoreListener?.();
        });
    }

    updateDatabase() {
        if (this.#isReady) {
            setDoc(doc(this.#firestore, "cards", this.cardId), this.value);
        }
    }
}

export function firestoreCard(cardId: string | null): FirestoreCard {
    return new FirestoreCard(cardId);
}
