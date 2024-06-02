import { DocumentReference, addDoc, collection, deleteDoc, doc, type DocumentData } from "firebase/firestore";
import { initializeFirebase } from "./firebase";
import type WordPack from "$lib/model/WordPack";

const firestore = initializeFirebase().firestore;

export function createWordPack(wordPack: WordPack): Promise<DocumentReference<DocumentData, DocumentData>> {
    return addDoc(collection(firestore, "wordPacks"), wordPack);
}

export function deleteWordPackById(wordPackId: string): Promise<void> {
    return deleteDoc(doc(firestore, "wordPacks", wordPackId));
}