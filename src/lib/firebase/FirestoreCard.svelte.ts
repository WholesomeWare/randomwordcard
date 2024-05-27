import { browser } from "$app/environment";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { initializeFirebase } from "./firebase.app";
import Card from "$lib/model/Card";

export class FirestoreCard {
    #firestore = initializeFirebase().firestore;
    #isReady = false;
    value: Card = $state<Card>(new Card());
    cardId: string;

    constructor(cardId: string) {
        this.cardId = cardId;

        if (browser) {
            getDoc(doc(this.#firestore, "cards", cardId))
                .then((doc) => {
                    if (doc.exists()) {
                        this.value = { ...new Card(), ...doc.data(), id: doc.id };
                    }
                    this.#isReady = true;
                });
        }

        $effect(() => {
            if (browser && this.#isReady) {
                setDoc(doc(this.#firestore, "cards", cardId), this.value);
            }
        });
    }
}

export function firestoreCard(cardId: string): FirestoreCard {
    return new FirestoreCard(cardId);
}
